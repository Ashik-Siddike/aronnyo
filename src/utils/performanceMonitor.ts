/**
 * Lightweight Performance Monitor
 * Tracks Core Web Vitals and reports to console (or analytics endpoint)
 */

interface PerformanceEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const ratings = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = ratings[metric as keyof typeof ratings];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportMetric(entry: PerformanceEntry) {
  const emoji = entry.rating === 'good' ? '✅' : entry.rating === 'needs-improvement' ? '⚠️' : '❌';
  console.log(
    `%c${emoji} [Perf] ${entry.name}: ${Math.round(entry.value)}ms (${entry.rating})`,
    `color: ${entry.rating === 'good' ? '#22c55e' : entry.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'}; font-weight: bold;`
  );
}

export function initPerformanceMonitor() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // First Contentful Paint (FCP)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const value = entry.startTime;
          reportMetric({ name: 'FCP', value, rating: getRating('FCP', value) });
        }
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (_) {}

  // Largest Contentful Paint (LCP) — only report final value
  try {
    let lcpFinalEntry: any = null;
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      lcpFinalEntry = entries[entries.length - 1];
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Report final LCP on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && lcpFinalEntry) {
        const value = lcpFinalEntry.startTime;
        reportMetric({ name: 'LCP', value, rating: getRating('LCP', value) });
        lcpObserver.disconnect();
      }
    }, { once: true });
  } catch (_) {}

  // Cumulative Layout Shift (CLS)
  try {
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportMetric({ name: 'CLS', value: clsScore * 1000, rating: getRating('CLS', clsScore) });
      }
    });
  } catch (_) {}

  // Long Tasks (>150ms only — page-load tasks < 150ms are normal for React)
  try {
    let longTaskCount = 0;
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 150) {
          longTaskCount++;
          console.warn(
            `%c⚠️ [Perf] Long Task #${longTaskCount}: ${Math.round(entry.duration)}ms (may affect interactivity)`,
            'color: #f59e0b; font-weight: bold;'
          );
        }
      }
    });
    longTaskObserver.observe({ type: 'longtask', buffered: false });
  } catch (_) {}

  // Navigation timing (TTFB)
  window.addEventListener('load', () => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (nav) {
      const ttfb = nav.responseStart - nav.requestStart;
      reportMetric({ name: 'TTFB', value: ttfb, rating: getRating('TTFB', ttfb) });
    }

    // Total page load time
    const loadTime = performance.now();
    console.log(
      `%c🚀 [Perf] Page fully loaded in: ${Math.round(loadTime)}ms`,
      'color: #6366f1; font-weight: bold;'
    );
  });
}
