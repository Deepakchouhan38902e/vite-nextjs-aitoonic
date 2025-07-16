// Performance monitoring utilities optimized for Core Web Vitals
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  if (typeof window === 'undefined') return fn();

  const start = performance.now();
  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      if (end - start > 100) { // Only log slow operations
        console.log(`${name} took ${end - start} milliseconds`);
      }
    });
  } else {
    const end = performance.now();
    if (end - start > 100) { // Only log slow operations
      console.log(`${name} took ${end - start} milliseconds`);
    }
    return result;
  }
}

// Enhanced Web Vitals tracking with reporting
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals with enhanced reporting
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, onINP }) => {
    // Largest Contentful Paint - Target: < 2.5s
    getLCP((metric) => {
      console.log('LCP:', metric);
      // Send to analytics if needed
      if (metric.value > 2500) {
        console.warn('LCP is slow:', metric.value);
      }
    });

    // First Input Delay - Target: < 100ms
    getFID((metric) => {
      console.log('FID:', metric);
      if (metric.value > 100) {
        console.warn('FID is slow:', metric.value);
      }
    });

    // Interaction to Next Paint - Target: < 200ms
    onINP((metric) => {
      console.log('INP:', metric);
      if (metric.value > 200) {
        console.warn('INP is slow:', metric.value);
      }
    });

    // Cumulative Layout Shift - Target: < 0.1
    getCLS((metric) => {
      console.log('CLS:', metric);
      if (metric.value > 0.1) {
        console.warn('CLS is high:', metric.value);
      }
    });

    // First Contentful Paint - Target: < 1.8s
    getFCP((metric) => {
      console.log('FCP:', metric);
      if (metric.value > 1800) {
        console.warn('FCP is slow:', metric.value);
      }
    });

    // Time to First Byte - Target: < 800ms
    getTTFB((metric) => {
      console.log('TTFB:', metric);
      if (metric.value > 800) {
        console.warn('TTFB is slow:', metric.value);
      }
    });
  }).catch(() => {
    // Silently fail if web-vitals can't be loaded
  });
}

// Resource hints for critical resources
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  // DNS prefetch for external domains
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = '//fonts.googleapis.com';
  document.head.appendChild(dnsPrefetch);

  // Preconnect to critical origins
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  // Preconnect to Supabase
  const supabasePreconnect = document.createElement('link');
  supabasePreconnect.rel = 'preconnect';
  supabasePreconnect.href = 'https://your-project.supabase.co';
  document.head.appendChild(supabasePreconnect);
}

// Optimize images for better LCP
export function optimizeImages() {
  if (typeof window === 'undefined') return;

  // Add loading="lazy" to all images below the fold
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (index > 2) { // First 3 images load eagerly
      img.loading = 'lazy';
    }
    
    // Add decode="async" for better performance
    img.decoding = 'async';
  });
}

// Reduce layout shifts
export function preventLayoutShifts() {
  if (typeof window === 'undefined') return;

  // Set explicit dimensions for images
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach((img) => {
    img.style.aspectRatio = '16/9'; // Default aspect ratio
  });
}

// Optimize third-party scripts
export function optimizeThirdPartyScripts() {
  if (typeof window === 'undefined') return;

  // Defer non-critical scripts
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
      script.defer = true;
    }
  });
}

// Memory management
export function cleanupMemory() {
  if (typeof window === 'undefined') return;

  // Clean up event listeners and observers when component unmounts
  return () => {
    // Remove will-change properties after animations
    const elements = document.querySelectorAll('[style*="will-change"]');
    elements.forEach((el) => {
      (el as HTMLElement).style.willChange = 'auto';
    });
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(callback: IntersectionObserverCallback) {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1
  });
}