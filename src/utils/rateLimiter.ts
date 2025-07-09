/**
 * Client-side rate limiting to reduce server pressure
 * Implements token bucket algorithm for smooth rate limiting
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: () => string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRate: number;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume(tokens = 1): boolean {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }

  getTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = (timePassed / 1000) * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

/**
 * Client-side rate limiter using localStorage
 */
export class ClientRateLimiter {
  private buckets = new Map<string, TokenBucket>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: () => 'default',
      ...config
    };
  }

  checkLimit(customKey?: string): RateLimitResult {
    const key = customKey || this.config.keyGenerator!();
    const storageKey = `rate_limit_${key}`;
    
    try {
      // Get or create bucket
      let bucket = this.buckets.get(key);
      if (!bucket) {
        // Try to restore from localStorage
        const stored = this.getStoredBucket(storageKey);
        if (stored) {
          bucket = new TokenBucket(this.config.maxRequests, this.config.maxRequests / (this.config.windowMs / 1000));
          // Restore state would be complex, so we start fresh
        } else {
          bucket = new TokenBucket(
            this.config.maxRequests,
            this.config.maxRequests / (this.config.windowMs / 1000)
          );
        }
        this.buckets.set(key, bucket);
      }

      const allowed = bucket.consume();
      const remaining = bucket.getTokens();
      const resetTime = Date.now() + this.config.windowMs;

      // Store current state
      this.storeBucket(storageKey, {
        tokens: remaining,
        lastRefill: Date.now(),
        resetTime
      });

      return {
        allowed,
        remaining,
        resetTime,
        retryAfter: allowed ? undefined : Math.ceil((1 - remaining) * (this.config.windowMs / this.config.maxRequests))
      };
    } catch (error) {
      // If localStorage fails, allow the request
      console.warn('Rate limiter storage failed:', error);
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: Date.now() + this.config.windowMs
      };
    }
  }

  private getStoredBucket(key: string): { tokens: number; lastRefill: number; resetTime: number } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private storeBucket(key: string, data: { tokens: number; lastRefill: number; resetTime: number }): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Storage failed, continue without storing
    }
  }

  reset(customKey?: string): void {
    const key = customKey || this.config.keyGenerator!();
    this.buckets.delete(key);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`rate_limit_${key}`);
      } catch {
        // Ignore storage errors
      }
    }
  }
}

/**
 * Simple in-memory rate limiter for server-side use
 */
export class MemoryRateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up expired entries every minute
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 60000);
    }
  }

  checkLimit(key: string): RateLimitResult {
    const now = Date.now();
    
    let entry = this.requests.get(key);
    
    // Reset if window expired
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }
    
    const allowed = entry.count < this.config.maxRequests;
    
    if (allowed) {
      entry.count++;
      this.requests.set(key, entry);
    }
    
    return {
      allowed,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      retryAfter: allowed ? undefined : entry.resetTime - now
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.requests.entries())) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Default rate limiters
export const apiRateLimiter = new ClientRateLimiter({
  maxRequests: 10, // 10 requests
  windowMs: 60000, // per minute
  keyGenerator: () => {
    // Use a combination of IP-like identifier and session
    const session = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('session_id') || Math.random().toString(36))
      : 'server';
    
    if (typeof window !== 'undefined' && !sessionStorage.getItem('session_id')) {
      try {
        sessionStorage.setItem('session_id', session);
      } catch {
        // Ignore storage errors
      }
    }
    
    return session;
  }
});

export const pickRateLimiter = new ClientRateLimiter({
  maxRequests: 30, // 30 picks
  windowMs: 60000, // per minute
  keyGenerator: () => 'picker_' + (typeof window !== 'undefined' ? window.location.hostname : 'server')
});