import express from 'express';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

async function createServer() {
  const app = express();

  // Enable compression
  app.use(compression());

  let vite: any;
  if (!isProduction) {
    // Development mode with Vite dev server
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.ssrLoadModule);
  } else {
    // Production mode
    app.use(express.static(resolve('dist/client'), {
      maxAge: '1y',
      etag: true,
      lastModified: true
    }));
  }

  // Cache for SSR pages
  const ssrCache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Define which routes should be SSR vs SSG
  const ssrRoutes = [
    '/admin',
    '/login',
    '/search',
    '/compare'
  ];

  const ssgRoutes = [
    '/',
    '/categories',
    '/ai-agent',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/advertise',
    '/affiliate',
    '/sitemap'
  ];

  // Middleware to determine rendering strategy
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    
    try {
      let template: string;
      let render: any;

      if (!isProduction) {
        // Development
        template = readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        // Production
        template = readFileSync(resolve('dist/client/index.html'), 'utf-8');
        render = (await import('../dist/server/entry-server.js')).render;
      }

      // Check if route should be SSR or SSG
      const isSSRRoute = ssrRoutes.some(route => url.startsWith(route));
      const isSSGRoute = ssgRoutes.some(route => url === route || url.startsWith(route));

      if (isSSRRoute) {
        // SSR: Always render fresh
        const { html, helmetContext } = render(url);
        const finalHtml = injectMetaTags(template, html, helmetContext);
        
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } else if (isSSGRoute) {
        // SSG: Check cache first
        const cacheKey = url;
        const cached = ssrCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          res.status(200).set({ 'Content-Type': 'text/html' }).end(cached.html);
          return;
        }

        const { html, helmetContext } = render(url);
        const finalHtml = injectMetaTags(template, html, helmetContext);
        
        // Cache the result
        ssrCache.set(cacheKey, {
          html: finalHtml,
          timestamp: Date.now()
        });
        
        res.status(200).set({ 
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600' // 1 hour cache
        }).end(finalHtml);
      } else {
        // Dynamic routes (tools, categories, agents) - SSR with short cache
        const cacheKey = url;
        const cached = ssrCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_TTL / 5) { // 1 minute cache
          res.status(200).set({ 'Content-Type': 'text/html' }).end(cached.html);
          return;
        }

        const { html, helmetContext } = render(url);
        const finalHtml = injectMetaTags(template, html, helmetContext);
        
        ssrCache.set(cacheKey, {
          html: finalHtml,
          timestamp: Date.now()
        });
        
        res.status(200).set({ 
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=300' // 5 minutes cache
        }).end(finalHtml);
      }
    } catch (e: any) {
      if (!isProduction) {
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  return { app, vite };
}

function injectMetaTags(template: string, appHtml: string, helmetContext: any) {
  const { helmet } = helmetContext;
  
  return template
    .replace('<!--app-head-->', helmet ? [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.script.toString()
    ].join('\n') : '')
    .replace('<!--app-html-->', appHtml);
}

createServer().then(({ app }) => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});