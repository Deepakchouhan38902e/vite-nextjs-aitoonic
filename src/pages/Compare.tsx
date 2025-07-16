import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Check, X, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category_id: string;
  image_url: string;
  favicon_url?: string;
  features: {
    title: string;
    description: string;
  }[];
  useCases: {
    title: string;
    description: string;
  }[];
  pricing: {
    plan: string;
    price: string;
    features: string[];
  }[];
  category_name?: string;
}

function Compare() {
  const { tools } = useParams<{ tools: string }>();
  const [tool1, setTool1] = useState<Tool | null>(null);
  const [tool2, setTool2] = useState<Tool | null>(null);
  const [similarTools, setSimilarTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTools() {
      if (!tools) return;

      const [tool1Slug, tool2Slug] = tools.split('-vs-').map(slug => slug.replace(/-/g, ' '));

      try {
        setLoading(true);
        const [{ data: tool1Data }, { data: tool2Data }] = await Promise.all([
          supabase
            .from('tools')
            .select(`
              *,
              categories (
                name
              )
            `)
            .ilike('name', tool1Slug)
            .single(),
          supabase
            .from('tools')
            .select(`
              *,
              categories (
                name
              )
            `)
            .ilike('name', tool2Slug)
            .single()
        ]);

        if (tool1Data && tool2Data) {
          const formattedTool1 = {
            ...tool1Data,
            category_name: tool1Data.categories?.name
          };
          const formattedTool2 = {
            ...tool2Data,
            category_name: tool2Data.categories?.name
          };

          setTool1(formattedTool1);
          setTool2(formattedTool2);

          // Fetch similar tools from the same category
          const { data: similarToolsData } = await supabase
            .from('tools')
            .select(`
              *,
              categories (
                name
              )
            `)
            .eq('category_id', tool1Data.category_id)
            .neq('id', tool1Data.id)
            .neq('id', tool2Data.id)
            .limit(4);

          if (similarToolsData) {
            setSimilarTools(
              similarToolsData.map(tool => ({
                ...tool,
                category_name: tool.categories?.name
              }))
            );
          }
        }
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, [tools]);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-dark flex items-center justify-center">
        <div className="text-royal-gold text-xl">Loading...</div>
      </div>
    );
  }

  if (!tool1 || !tool2) {
    return (
      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Tools Not Found</h1>
            <p className="text-gray-400 mb-8">The tools you're looking for don't exist or have been removed.</p>
            <Link 
              to="/categories"
              className="inline-flex items-center text-royal-gold hover:text-royal-gold/80"
            >
              <ChevronRight className="w-5 h-5 mr-2" />
              Browse All Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${tool1.name} vs ${tool2.name} Comparison | Aitoonic`}
        description={`Compare ${tool1.name} and ${tool2.name}. See features, pricing, and find out which tool is best for your needs.`}
      />

      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <Link to="/categories" className="text-gray-400 hover:text-white">Tools</Link>
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-gray-300">Compare</span>
          </div>

          <h1 className="text-4xl font-bold mb-6 gradient-text text-center">
            {tool1.name} vs {tool2.name}
          </h1>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[tool1, tool2].map((tool) => (
              <div
                key={tool.id}
                className="bg-royal-dark-card rounded-xl overflow-hidden border border-royal-dark-lighter"
              >
                <div className="aspect-video relative">
                  <img
                    src={tool.image_url}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {tool.favicon_url && (
                      <img
                        src={tool.favicon_url}
                        alt={`${tool.name} logo`}
                        className="w-12 h-12 rounded-lg object-contain bg-white p-2"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
                      {tool.category_name && (
                        <span className="text-gray-400">{tool.category_name}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">{tool.description}</p>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-royal-gold text-royal-dark px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                  >
                    Visit Website
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="bg-royal-dark-card rounded-xl p-8 border border-royal-dark-lighter mb-12">
            <h2 className="text-2xl font-bold mb-8">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-royal-dark-lighter">
                    <th className="text-left py-4 px-6">Feature</th>
                    <th className="text-center py-4 px-6">{tool1.name}</th>
                    <th className="text-center py-4 px-6">{tool2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {tool1.features.map((feature, index) => (
                    <tr key={index} className="border-b border-royal-dark-lighter">
                      <td className="py-4 px-6">{feature.title}</td>
                      <td className="text-center py-4 px-6">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-6">
                        {tool2.features.some(f => f.title === feature.title) ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                  {tool2.features
                    .filter(f2 => !tool1.features.some(f1 => f1.title === f2.title))
                    .map((feature, index) => (
                      <tr key={`unique-${index}`} className="border-b border-royal-dark-lighter">
                        <td className="py-4 px-6">{feature.title}</td>
                        <td className="text-center py-4 px-6">
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="bg-royal-dark-card rounded-xl p-8 border border-royal-dark-lighter mb-12">
            <h2 className="text-2xl font-bold mb-8">Pricing Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[tool1, tool2].map((tool) => (
                <div key={`pricing-${tool.id}`}>
                  <h3 className="text-xl font-bold mb-6">{tool.name} Pricing</h3>
                  <div className="space-y-6">
                    {tool.pricing.map((plan, index) => (
                      <div
                        key={index}
                        className="bg-royal-dark rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold">{plan.plan}</h4>
                          <span className="text-royal-gold font-semibold">{plan.price}</span>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-gray-300">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Tools */}
          {similarTools.length > 0 && (
            <div className="bg-royal-dark-card rounded-xl p-8 border border-royal-dark-lighter">
              <h2 className="text-2xl font-bold mb-8">Similar Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {similarTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img
                        src={tool.image_url}
                        alt={tool.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-royal-gold transition-colors">
                      {tool.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Compare;