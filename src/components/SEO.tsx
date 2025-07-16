import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object;
  noindex?: boolean;
  canonical?: string;
  alternateLanguages?: {
    lang: string;
    url: string;
  }[];
  twitterHandle?: string;
  facebookAppId?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = 'https://aitoonic.com/og-image.jpg',
  type = 'website',
  schema,
  noindex = false,
  canonical,
  alternateLanguages = [],
  twitterHandle,
  facebookAppId
}: SEOProps) {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://aitoonic.com';

  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const currentUrl = `${baseUrl}${currentPath}${location.search}`;
  const canonicalUrl = canonical || currentUrl;

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    description,
    url: canonicalUrl,
  };

  const fullSchema = schema ? [baseSchema, schema] : [baseSchema];

  return (
    <Helmet>
      {/* HTML Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical Tag (Only one!) */}
      {canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}

      {/* Hreflang Tags */}
      {alternateLanguages.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Aitoonic" />
      {facebookAppId && <meta property="fb:app_id" content={facebookAppId} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {twitterHandle && <meta name="twitter:site" content={`@${twitterHandle}`} />}

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(fullSchema)}
      </script>
    </Helmet>
  );
}
