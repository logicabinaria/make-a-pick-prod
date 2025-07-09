// Ad Refresh Analytics and Monitoring
// Tracks performance metrics and success/failure rates

import { AdRefreshMetrics, AdRefreshResult, AdRefreshErrorType } from '@/types/ads';
import { ANALYTICS_SETTINGS } from '@/config/adRefresh';

class AdAnalytics {
  private metrics: AdRefreshMetrics = {
    totalRefreshes: 0,
    successfulRefreshes: 0,
    failedRefreshes: 0,
    averageRefreshTime: 0,
    lastRefreshTime: 0
  };

  private refreshTimes: number[] = [];
  private eventQueue: AdRefreshResult[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicFlush();
  }

  /**
   * Record an ad refresh attempt
   */
  recordRefresh(result: AdRefreshResult): void {
    this.metrics.totalRefreshes++;
    this.metrics.lastRefreshTime = Date.now();

    if (result.success) {
      this.metrics.successfulRefreshes++;
      this.refreshTimes.push(result.duration);
      this.updateAverageRefreshTime();
    } else {
      this.metrics.failedRefreshes++;
    }

    // Add to event queue for batch processing
    this.eventQueue.push(result);

    // Flush if queue is full
    if (this.eventQueue.length >= ANALYTICS_SETTINGS.BATCH_SIZE) {
      this.flushEvents();
    }

    // Log important events
    this.logEvent(result);
  }

  /**
   * Get current metrics
   */
  getMetrics(): AdRefreshMetrics {
    return { ...this.metrics };
  }

  /**
   * Get success rate as percentage
   */
  getSuccessRate(): number {
    if (this.metrics.totalRefreshes === 0) return 0;
    return (this.metrics.successfulRefreshes / this.metrics.totalRefreshes) * 100;
  }

  /**
   * Get error distribution
   */
  getErrorDistribution(): Record<AdRefreshErrorType, number> {
    const distribution: Record<AdRefreshErrorType, number> = {
      [AdRefreshErrorType.NETWORK_ERROR]: 0,
      [AdRefreshErrorType.SCRIPT_LOAD_ERROR]: 0,
      [AdRefreshErrorType.PROVIDER_ERROR]: 0,
      [AdRefreshErrorType.CACHE_ERROR]: 0,
      [AdRefreshErrorType.TIMEOUT_ERROR]: 0
    };

    this.eventQueue.forEach(event => {
      if (!event.success && event.error) {
        distribution[event.error.type]++;
      }
    });

    return distribution;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = {
      totalRefreshes: 0,
      successfulRefreshes: 0,
      failedRefreshes: 0,
      averageRefreshTime: 0,
      lastRefreshTime: 0
    };
    this.refreshTimes = [];
    this.eventQueue = [];
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): string {
    const successRate = this.getSuccessRate();
    const avgTime = this.metrics.averageRefreshTime;
    
    return `Ad Refresh Performance: ${successRate.toFixed(1)}% success rate, ${avgTime.toFixed(0)}ms avg time, ${this.metrics.totalRefreshes} total refreshes`;
  }

  private updateAverageRefreshTime(): void {
    if (this.refreshTimes.length === 0) return;
    
    const sum = this.refreshTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageRefreshTime = sum / this.refreshTimes.length;
    
    // Keep only last 100 refresh times to prevent memory bloat
    if (this.refreshTimes.length > 100) {
      this.refreshTimes = this.refreshTimes.slice(-100);
    }
  }

  private logEvent(result: AdRefreshResult): void {
    const level = result.success ? 'info' : 'warn';
    const message = result.success 
      ? `✅ Ad refresh successful for ${result.provider} (${result.duration}ms)`
      : `❌ Ad refresh failed for ${result.provider}: ${result.error?.message}`;
    
    console[level](`[AdAnalytics] ${message}`);
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, ANALYTICS_SETTINGS.FLUSH_INTERVAL);
  }

  private flushEvents(): void {
    if (this.eventQueue.length === 0) return;

    // In a real application, you might send these to an analytics service
    // For now, we'll just log a summary
    const successCount = this.eventQueue.filter(e => e.success).length;
    const failureCount = this.eventQueue.length - successCount;
    
    console.info(`[AdAnalytics] Batch flush: ${successCount} successes, ${failureCount} failures`);
    
    // Clear the queue
    this.eventQueue = [];
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flushEvents(); // Final flush
  }
}

// Export singleton instance
export const adAnalytics = new AdAnalytics();

// Convenience functions
export const recordAdRefresh = (result: AdRefreshResult) => 
  adAnalytics.recordRefresh(result);

export const getAdMetrics = () => 
  adAnalytics.getMetrics();

export const getAdSuccessRate = () => 
  adAnalytics.getSuccessRate();

export const getAdPerformanceSummary = () => 
  adAnalytics.getPerformanceSummary();