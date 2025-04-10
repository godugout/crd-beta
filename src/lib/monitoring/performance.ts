
import { startTransaction } from './sentry';

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private static instance: PerformanceMonitor;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startMeasurement(name: string, metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      startTime: window.performance.now(),
      metadata
    });
  }

  public endMeasurement(name: string, additionalMetadata?: Record<string, any>): number | undefined {
    const metric = this.metrics.get(name);
    
    if (!metric) {
      console.warn(`No measurement found with name: ${name}`);
      return;
    }
    
    const duration = window.performance.now() - metric.startTime;
    metric.duration = duration;
    
    if (additionalMetadata) {
      metric.metadata = { ...metric.metadata, ...additionalMetadata };
    }
    
    this.reportMetric(metric);
    this.metrics.delete(name);
    
    return duration;
  }

  private reportMetric(metric: PerformanceMetric): void {
    // Log performance data
    console.debug(`Performance: ${metric.name} - ${metric.duration?.toFixed(2)}ms`, metric.metadata);
    
    // In production, send to monitoring service
    if (import.meta.env.PROD && metric.duration && metric.duration > 500) {
      const transaction = startTransaction(metric.name, 'performance');
      
      if (transaction) {
        transaction.setData('duration', metric.duration);
        
        if (metric.metadata) {
          transaction.setData('metadata', metric.metadata);
        }
        
        transaction.finish();
      }
    }
  }

  public measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    this.startMeasurement(name, metadata);
    
    return fn().then(result => {
      this.endMeasurement(name);
      return result;
    }).catch(error => {
      this.endMeasurement(name, { error: error.message });
      throw error;
    });
  }
}

export const performance = PerformanceMonitor.getInstance();
