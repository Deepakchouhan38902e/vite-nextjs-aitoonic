import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Only run on client-side
if (typeof window !== 'undefined') {
  const container = document.getElementById('root');
  
  if (container) {
    // Check if we're hydrating or doing initial render
    const isHydrating = container.hasChildNodes();
    
    if (isHydrating) {
      // Hydrate existing content
      import('react-dom/client').then(({ hydrateRoot }) => {
        hydrateRoot(
          container,
          <StrictMode>
            <HelmetProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </HelmetProvider>
          </StrictMode>
        );
      });
    } else {
      // Initial client-side render
      createRoot(container).render(
        <StrictMode>
          <HelmetProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </HelmetProvider>
        </StrictMode>
      );
    }
  }
}