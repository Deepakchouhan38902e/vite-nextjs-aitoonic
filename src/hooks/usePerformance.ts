import { useEffect } from 'react';

export function usePerformance() {
  useEffect(() => {
    // Optimize images after component mount
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        // First 3 images load eagerly for LCP
        if (index < 3) {
          img.loading = 'eager';
          img.fetchPriority = 'high';
        } else {
          img.loading = 'lazy';
          img.fetchPriority = 'low';
        }
        img.decoding = 'async';
      });
    };

    // Prevent layout shifts
    const preventLayoutShifts = () => {
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach((img) => {
        if (!img.style.aspectRatio) {
          img.style.aspectRatio = '16/9';
        }
      });
    };

    // Run optimizations
    optimizeImages();
    preventLayoutShifts();

    // Clean up will-change properties after animations
    const cleanup = () => {
      const elements = document.querySelectorAll('[style*="will-change"]');
      elements.forEach((el) => {
        (el as HTMLElement).style.willChange = 'auto';
      });
    };

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          optimizeImages();
          preventLayoutShifts();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);
}