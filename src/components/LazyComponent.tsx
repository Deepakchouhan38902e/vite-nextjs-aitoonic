import React, { Suspense, lazy } from 'react';
import { useSSR } from '../hooks/useSSR';

interface LazyComponentProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export function LazyComponent({ importFunc, fallback = <div>Loading...</div>, children }: LazyComponentProps) {
  const isSSR = useSSR();

  if (isSSR) {
    return <>{fallback}</>;
  }

  const Component = lazy(importFunc);

  return (
    <Suspense fallback={fallback}>
      <Component>{children}</Component>
    </Suspense>
  );
}