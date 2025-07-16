import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Bot, ExternalLink, ChevronRight, DollarSign, Check, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category_id: string;
  image_url: string;
  favicon_url?: string;
  rating?: number;
  seo_title?: string;
  seo_description?: string;
  how_to_use?: string;
  features?: {
    title: string;
    description: string;
  }[];
  useCases?: {
    title: string;
    description: string;
  }[];
  pricing?: {
    plan: string;
    price: string;
    features: string[];
  }[];
}

interface Category {
  id: string;
  name: string;
}

interface ToolDetailProps {
  tool: Tool | null;
  category: Category | null;
  similarTools: Tool[];
}

export default function ToolDetail({ tool, category, similarTools }: ToolDetailProps) {
  if (!tool) {
    return (
      <Layout>
        <Head>
          <title>Tool Not Found | Aitoonic</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Tool Not Found</h1>
              <p className="text-slate-400 mb-8">The tool you're looking for doesn't exist or has been removed.</p>
              <Link 
                href="/categories"
                className="inline-flex items-center text-primary-500 hover:text-primary-400"
              >
                <ChevronRight className="w-5 h-5 mr-2" />
                Back to Categories
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{tool.seo_title || tool.name} | Aitoonic</title>
        <meta name="description" content={tool.seo_description || tool.description} />
        <meta property="og:title" content={tool.seo_title || tool.name} />
        <meta property="og:description" content={tool.seo_description || tool.description} />
        <meta property="og:image" content={tool.image_url} />
        <meta property="og:type" content="product" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: tool.name,
              description: tool.description,
              applicationCategory: 'AIApplication',
              operatingSystem: 'Web',
              url: `https://aitoonic.com/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`,
              image: tool.image_url,
              offers: {
                '@type': 'Offer',
                price: tool.pricing?.[0]?.price?.replace('$', '') || '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/OnlineOnly'
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
            {category && (
              <>
                <Link
                  href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-slate-400 hover:text-white"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
              </>
            )}
            <span className="text-slate-300">{tool.name}</span>
          </div>

          {/* Tool Details */}
          <div className="max-w-4xl mx-auto card overflow-hidden">
            <div className="aspect-16-9 relative">
              <Image
                src={tool.image_url || 'https://i.imgur.com/ZXqf6Kx.png'}
                alt={tool.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-4 sm:p-8">
              {/* Tool Name and Rating */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    {tool.favicon_url ? (
                      <Image 
                        src={tool.favicon_url} 
                        alt={`${tool.name} logo`}
                        width={48}
                        height={48}
                        className="rounded-lg object-contain bg-white p-2"
                      />
                    ) : (
                      <Bot className="w-12 h-12 text-primary-500" />
                    )}
                    <div>
                      <h1 className="text-3xl font-bold gradient-text">{tool.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        {tool.rating && (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className="w-5 h-5 text-yellow-500" 
                                fill={i < Math.floor(tool.rating!) ? "currentColor" : "none"}
                              />
                            ))}
                            <span className="ml-2 text-slate-300">({tool.rating})</span>
                          </div>
                        )}
                        {category && (
                          <Link
                            href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-primary-500 hover:text-primary-400 transition-colors"
                          >
                            {category.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-lg">{tool.description}</p>
                </div>
                {tool.pricing && tool.pricing.length > 0 && (
                  <div className="flex items-center space-x-2 bg-slate-700 rounded-full px-4 py-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 font-medium">
                      {tool.pricing[0].price}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center btn-primary"
                  >
                    Try Tool Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
                {similarTools.length > 0 && (
                  <Link
                    href={`/compare/${tool.name.toLowerCase().replace(/\s+/g, '-')}-vs-${similarTools[0].name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center border-2 border-primary-500 text-primary-500 px-6 py-3 rounded-lg font-bold hover:bg-primary-500 hover:text-white transition-all"
                  >
                    Compare with {similarTools[0].name}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Features, Use Cases, How to Use, and Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              {/* How to Use */}
              {tool.how_to_use && (
                <div className="card p-4 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-primary-500" />
                    How to Use {tool.name}
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 whitespace-pre-wrap">{tool.how_to_use}</p>
                  </div>
                </div>
              )}

              {/* Features */}
              {tool.features && tool.features.length > 0 && (
                <div className="card p-4 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div>
                          <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                          <p className="text-slate-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Use Cases */}
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="card p-4 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {tool.useCases.map((useCase, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div>
                          <h3 className="font-semibold text-white mb-1">{useCase.title}</h3>
                          <p className="text-slate-400">{useCase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="lg:col-span-1">
              {tool.pricing && tool.pricing.length > 0 && (
                <div className="card p-4 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6">Pricing Plans</h2>
                  <div className="space-y-6">
                    {tool.pricing.map((plan, index) => (
                      <div
                        key={index}
                        className={`bg-slate-700 rounded-lg p-6 border ${
                          index === 1 ? 'border-primary-500' : 'border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-white">{plan.plan}</h3>
                          <span className="text-green-500 font-semibold text-xl">{plan.price}</span>
                        </div>
                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-slate-300">
                              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {tool.url && (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all ${
                              index === 1
                                ? 'btn-primary'
                                : 'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white'
                            }`}
                          >
                            Get Started
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Tools */}
              {similarTools.length > 0 && (
                <div className="card p-4 sm:p-8 mt-8">
                  <h2 className="text-2xl font-bold mb-6">Similar Tools</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {similarTools.map((similarTool) => (
                      <Link
                        key={similarTool.id}
                        href={`/ai/${similarTool.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group block"
                      >
                        <div className="card p-3 hover:border-primary-500 transition-colors">
                          <div className="aspect-16-9 rounded-lg overflow-hidden mb-3">
                            <Image
                              src={similarTool.image_url || 'https://i.imgur.com/ZXqf6Kx.png'}
                              alt={similarTool.name}
                              width={200}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-semibold text-white group-hover:text-primary-500 transition-colors text-sm">
                            {similarTool.name}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params!;
  
  try {
    const { data: toolData } = await supabase
      .from('tools')
      .select('*, categories!inner(*)')
      .ilike('name', (slug as string).replace(/-/g, ' '))
      .single();
    
    if (!toolData) {
      return {
        props: {
          tool: null,
          category: null,
          similarTools: []
        }
      };
    }

    // Fetch similar tools from the same category
    const { data: similarToolsData } = await supabase
      .from('tools')
      .select('*')
      .eq('category_id', toolData.category_id)
      .neq('id', toolData.id)
      .limit(4);

    return {
      props: {
        tool: toolData,
        category: toolData.categories,
        similarTools: similarToolsData || []
      }
    };
  } catch (error) {
    console.error('Error fetching tool:', error);
    return {
      props: {
        tool: null,
        category: null,
        similarTools: []
      }
    };
  }
};