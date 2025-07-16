import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const robots = `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://aitoonic.com/sitemap.xml

# Disallow admin area
Disallow: /admin

# Crawl-delay
Crawl-delay: 10

# Additional rules
Allow: /*.js
Allow: /*.css
Allow: /*.png
Allow: /*.jpg
Allow: /*.gif
Allow: /*.svg
Allow: /*.ico

# Prevent duplicate content
Disallow: /*?*
Disallow: /*?`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(robots);
}