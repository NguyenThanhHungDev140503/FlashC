import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
}

/**
 * Hook để monitor performance của components
 */
export function usePerformanceMonitor(componentName: string) {
  const startTimeRef = useRef<number>(Date.now());
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  useEffect(() => {
    const startTime = startTimeRef.current;
    
    return () => {
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
      };
      
      metricsRef.current.push(metrics);
      
      // Log slow renders in development
      if (__DEV__ && renderTime > 100) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
      }
    };
  }, [componentName]);

  const getMetrics = () => metricsRef.current;
  
  const getAverageRenderTime = () => {
    const metrics = metricsRef.current;
    if (metrics.length === 0) return 0;
    
    const totalTime = metrics.reduce((sum, metric) => sum + metric.renderTime, 0);
    return totalTime / metrics.length;
  };

  return {
    getMetrics,
    getAverageRenderTime,
  };
}

/**
 * Hook để monitor memory usage (placeholder for native implementation)
 */
export function useMemoryMonitor() {
  const getMemoryUsage = (): number => {
    // This would require native implementation
    // For now, return 0 as placeholder
    return 0;
  };

  const trackMemoryUsage = (label: string) => {
    if (__DEV__) {
      const usage = getMemoryUsage();
      console.log(`Memory usage [${label}]: ${usage}MB`);
    }
  };

  return {
    getMemoryUsage,
    trackMemoryUsage,
  };
}