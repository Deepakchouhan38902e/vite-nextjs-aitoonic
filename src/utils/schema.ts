export function generateToolSchema(tool: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'AIApplication',
    operatingSystem: 'Web',
    url: `https://aitoonic.com/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
    ...(tool.image_url && { image: tool.image_url }),
    ...(tool.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.rating,
        ratingCount: '100',
        bestRating: '5',
        worstRating: '1'
      }
    }),
    offers: {
      '@type': 'Offer',
      price: tool.pricing?.[0]?.price?.replace('$', '') || '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly'
    }
  };
}

export function generateCategorySchema(category: any, tools: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://aitoonic.com/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
    hasPart: tools.map(tool => ({
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      url: `https://aitoonic.com/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`
    }))
  };
}

export function generateAgentSchema(agent: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: agent.name,
    description: agent.description,
    url: `https://aitoonic.com/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`,
    ...(agent.image_url && { image: agent.image_url }),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly'
    }
  };
}