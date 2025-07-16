import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  priority?: boolean;
  aspectRatio?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMEYxNDI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==',
  priority = false,
  aspectRatio = '16/9',
  className = '',
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Placeholder */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-slate-700 animate-pulse"
          style={{ aspectRatio }}
        />
      )}
      
      {/* Actual Image */}
      <img
        ref={imgRef}
        src={isInView ? src : placeholder}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Error fallback */}
      {error && (
        <div 
          className="absolute inset-0 bg-slate-600 flex items-center justify-center text-slate-400 text-sm"
          style={{ aspectRatio }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}