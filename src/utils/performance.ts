/**
 * Performance monitoring utilities for optimizing user experience
 * Runs silently in the background without exposing developer features
 */

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory: MemoryInfo;
}

export interface PerformanceMetrics {
  pickLatency: number;
  renderTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 10; // Keep only recent metrics

  /**
   * Measure the time taken for a pick operation
   */
  measurePickLatency<T>(operation: () => T | Promise<T>): Promise<{ result: T; latency: number }> {
    const startTime = performance.now();
    
    const handleResult = (result: T) => {
      const latency = performance.now() - startTime;
      this.recordMetric({ pickLatency: latency, renderTime: 0 });
      return { result, latency };
    };

    try {
      const result = operation();
      if (result instanceof Promise) {
        return result.then(handleResult);
      }
      return Promise.resolve(handleResult(result));
    } catch (error) {
      const latency = performance.now() - startTime;
      this.recordMetric({ pickLatency: latency, renderTime: 0 });
      throw error;
    }
  }

  /**
   * Record performance metrics
   */
  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push({
      ...metric,
      memoryUsage: this.getMemoryUsage()
    });

    // Keep only recent metrics to prevent memory bloat
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get memory usage if available (for optimization purposes)
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance && (performance as PerformanceWithMemory).memory) {
      return (performance as PerformanceWithMemory).memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Get average pick latency for optimization decisions
   */
  getAverageLatency(): number {
    if (this.metrics.length === 0) return 0;
    
    const totalLatency = this.metrics.reduce((sum, metric) => sum + metric.pickLatency, 0);
    return totalLatency / this.metrics.length;
  }

  /**
   * Determine if client-side picking should be preferred based on performance
   */
  shouldPreferClientSide(): boolean {
    const avgLatency = this.getAverageLatency();
    // If average latency is very low, client-side is working well
    return avgLatency < 50; // 50ms threshold
  }

  /**
   * Clear metrics (for memory management)
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Optimize component rendering by debouncing rapid state changes
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls to prevent excessive API usage
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Preload critical resources for better UX
 */
export function preloadCriticalResources(): void {
  // Preload confetti library if not already loaded
  if (typeof window !== 'undefined') {
    // This helps ensure smooth animations
    requestIdleCallback(() => {
      import('canvas-confetti').catch(() => {
        // Ignore preload errors
      });
    });
  }
}

/**
 * Memory-efficient random number generation
 */
export function getSecureRandom(): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  // Fallback to Math.random
  return Math.random();
}