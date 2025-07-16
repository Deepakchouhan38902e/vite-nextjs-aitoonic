import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all data in parallel
    const [
      { data: tools },
      { data: categories },
      { data: agents }
    ] = await Promise.all([
      supabase.from('tools').select('name, created_at, updated_at'),
      supabase.from('categories').select('name, created_at, updated_at'),
      supabase.from('agents').select('name, created_at, updated_at').eq('status', 'active')
    ]);

    const baseUrl = 'https://aitoonic.com';
    const currentDate = new Date().toISOString();

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${currentDate}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${currentDate}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/ai-agent</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${currentDate}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/advertise</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/affiliate</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Tools -->
  ${tools?.map(tool => `
  <url>
    <loc>${baseUrl}/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${tool.updated_at || tool.created_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || ''}

  <!-- Categories -->
  ${categories?.map(category => `
  <url>
    <loc>${baseUrl}/category/${category.name.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${category.updated_at || category.created_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || ''}

  <!-- Agents -->
  ${agents?.map(agent => `
  <url>
    <loc>${baseUrl}/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${agent.updated_at || agent.created_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || ''}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Error generating sitemap' });
  }
}