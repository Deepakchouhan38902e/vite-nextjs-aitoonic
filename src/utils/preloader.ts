// Optimized preloader for Core Web Vitals
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.as = 'style';
  criticalCSS.href = '/src/index.css';
  document.head.appendChild(criticalCSS);

  // Preload critical fonts with font-display: swap
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload hero image for better LCP
  const heroImage = new Image();
  heroImage.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200';
  heroImage.loading = 'eager';
}

// Prefetch next page resources
export function prefetchRoute(route: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
}

// Optimized image preloading with WebP support
export function preloadImage(src: string, options: { priority?: boolean } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set loading priority
    if (options.priority) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    } else {
      img.loading = 'lazy';
    }
    
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Preload critical above-the-fold images
export function preloadCriticalImages() {
  if (typeof window === 'undefined') return;

  const criticalImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1676277791608-ac54783d753b?auto=format&fit=crop&q=80&w=800'
  ];

  criticalImages.forEach((src, index) => {
    preloadImage(src, { priority: index < 2 });
  });
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}