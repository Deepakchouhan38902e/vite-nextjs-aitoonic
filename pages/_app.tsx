import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sparkles.svg" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Critical CSS for Core Web Vitals */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html, body { max-width: 100%; overflow-x: hidden; }
            body { 
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              color: #ffffff;
              font-family: Inter, system-ui, sans-serif;
              line-height: 1.5;
              min-height: 100vh;
            }
            #__next { min-height: 100vh; }
          `
        }} />
      </Head>
      
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}