import { build } from 'vite';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { supabase } from '../src/lib/supabase';

// Static routes to pre-generate
const staticRoutes = [
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

async function generateStaticSite() {
  console.log('Building SSG pages...');

  // Build the app for production
  await build({
    build: {
      ssr: true,
      outDir: 'dist/server'
    }
  });

  await build({
    build: {
      outDir: 'dist/client'
    }
  });

  // Import the server render function
  const { render } = await import('../dist/server/entry-server.js');

  // Generate dynamic routes
  const dynamicRoutes = await generateDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Generate HTML for each route
  for (const route of allRoutes) {
    try {
      const { html, helmetContext } = render(route);
      const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/sparkles.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${helmetContext.helmet ? [
      helmetContext.helmet.title.toString(),
      helmetContext.helmet.meta.toString(),
      helmetContext.helmet.link.toString()
    ].join('\n') : ''}
  </head>
  <body>
    <div id="root">${html}</div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>`;

      const filePath = route === '/' ? '/index.html' : `${route}/index.html`;
      const fullPath = resolve(`dist/static${filePath}`);
      
      // Create directory if it doesn't exist
      const dir = dirname(fullPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(fullPath, template);
      console.log(`Generated: ${filePath}`);
    } catch (error) {
      console.error(`Error generating ${route}:`, error);
    }
  }

  console.log('SSG build complete!');
}

async function generateDynamicRoutes(): Promise<string[]> {
  const routes: string[] = [];

  try {
    // Fetch tools
    const { data: tools } = await supabase
      .from('tools')
      .select('name');
    
    if (tools) {
      tools.forEach(tool => {
        routes.push(`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`);
      });
    }

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('name');
    
    if (categories) {
      categories.forEach(category => {
        routes.push(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`);
      });
    }

    // Fetch agents
    const { data: agents } = await supabase
      .from('agents')
      .select('name')
      .eq('status', 'active');
    
    if (agents) {
      agents.forEach(agent => {
        routes.push(`/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`);
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic routes:', error);
  }

  return routes;
}

generateStaticSite().catch(console.error);