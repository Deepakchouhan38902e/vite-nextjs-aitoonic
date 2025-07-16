import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/xml',
};

function generateSitemapIndex(sitemaps: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>https://aitoonic.com/sitemap/${sitemap}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;
}

function generateUrlset(urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('')}
</urlset>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop()?.replace('.xml', '') || 'index';

  try {
    switch (path) {
      case 'index': {
        // Main sitemap index
        const sitemaps = ['main', 'tools', 'categories', 'agents', 'search'];
        return new Response(generateSitemapIndex(sitemaps), { headers: corsHeaders });
      }

      case 'main': {
        // Static pages sitemap
        const urls = [
          { loc: 'https://aitoonic.com/', changefreq: 'daily', priority: '1.0' },
          { loc: 'https://aitoonic.com/categories', changefreq: 'daily', priority: '0.9' },
          { loc: 'https://aitoonic.com/ai-agent', changefreq: 'daily', priority: '0.9' },
          { loc: 'https://aitoonic.com/about', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://aitoonic.com/contact', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://aitoonic.com/terms', changefreq: 'monthly', priority: '0.5' },
          { loc: 'https://aitoonic.com/privacy', changefreq: 'monthly', priority: '0.5' },
          { loc: 'https://aitoonic.com/advertise', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://aitoonic.com/affiliate', changefreq: 'monthly', priority: '0.5' }
        ];
        return new Response(generateUrlset(urls), { headers: corsHeaders });
      }

      case 'tools': {
        // Tools sitemap
        const { data: tools } = await supabase
          .from('tools')
          .select('name, created_at, updated_at');

        const urls = tools?.map(tool => ({
          loc: `https://aitoonic.com/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
          lastmod: tool.updated_at || tool.created_at,
          changefreq: 'weekly',
          priority: '0.8'
        })) || [];

        return new Response(generateUrlset(urls), { headers: corsHeaders });
      }

      case 'categories': {
        // Categories sitemap
        const { data: categories } = await supabase
          .from('categories')
          .select('name, created_at');

        const urls = categories?.map(category => ({
          loc: `https://aitoonic.com/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
          lastmod: category.created_at,
          changefreq: 'weekly',
          priority: '0.8'
        })) || [];

        return new Response(generateUrlset(urls), { headers: corsHeaders });
      }

      case 'agents': {
        // Agents sitemap
        const { data: agents } = await supabase
          .from('agents')
          .select('name, created_at')
          .eq('status', 'active');

        const urls = agents?.map(agent => ({
          loc: `https://aitoonic.com/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`,
          lastmod: agent.created_at,
          changefreq: 'weekly',
          priority: '0.8'
        })) || [];

        return new Response(generateUrlset(urls), { headers: corsHeaders });
      }

      case 'search': {
        // Search pages sitemap
        const { data: searchTerms } = await supabase
          .from('search_terms')
          .select('term, created_at')
          .order('count', { ascending: false })
          .limit(1000);

        const urls = searchTerms?.map(term => ({
          loc: `https://aitoonic.com/s/${encodeURIComponent(term.term)}`,
          lastmod: term.created_at,
          changefreq: 'weekly',
          priority: '0.6'
        })) || [];

        return new Response(generateUrlset(urls), { headers: corsHeaders });
      }

      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
});