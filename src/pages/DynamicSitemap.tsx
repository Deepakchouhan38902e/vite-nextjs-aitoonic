import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

function DynamicSitemap() {
  const { type } = useParams<{ type: string }>();
  const [urls, setUrls] = useState<SitemapUrl[]>([]);

  useEffect(() => {
    async function generateSitemap() {
      let sitemapUrls: SitemapUrl[] = [];

      switch (type) {
        case 'main':
          sitemapUrls = [
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
          break;

        case 'tools':
          const { data: tools } = await supabase
            .from('tools')
            .select('name, created_at, updated_at');

          sitemapUrls = tools?.map(tool => ({
            loc: `https://aitoonic.com/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
            lastmod: tool.updated_at || tool.created_at,
            changefreq: 'weekly',
            priority: '0.8'
          })) || [];
          break;

        case 'categories':
          const { data: categories } = await supabase
            .from('categories')
            .select('name, created_at, updated_at');

          sitemapUrls = categories?.map(category => ({
            loc: `https://aitoonic.com/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
            lastmod: category.updated_at || category.created_at,
            changefreq: 'weekly',
            priority: '0.8'
          })) || [];
          break;

        case 'agents':
          const { data: agents } = await supabase
            .from('agents')
            .select('name, created_at, updated_at')
            .eq('status', 'active');

          sitemapUrls = agents?.map(agent => ({
            loc: `https://aitoonic.com/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`,
            lastmod: agent.updated_at || agent.created_at,
            changefreq: 'weekly',
            priority: '0.8'
          })) || [];
          break;
      }

      setUrls(sitemapUrls);
    }

    generateSitemap();
  }, [type]);

  const generateXML = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  };

  // Set content type to XML
  useEffect(() => {
    if (urls.length > 0) {
      const xmlContent = generateXML();
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Replace current page content with XML
      document.open();
      document.write(xmlContent);
      document.close();
      document.contentType = 'application/xml';
    }
  }, [urls]);

  return null; // Component doesn't render anything visible
}

export default DynamicSitemap;