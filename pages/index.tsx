import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, Calendar, TrendingUp, Bookmark, Users, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

interface Category {
  id: string;
  name: string;
  description: string;
  tool_count: number;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category_id: string;
  image_url: string;
  created_at: string;
}

interface HomeProps {
  categories: Category[];
  tools: Tool[];
  featuredTools: Tool[];
}

export default function Home({ categories, tools, featuredTools }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'today' | 'new' | 'saved' | 'used'>('new');

  const filteredTools = useMemo(() => {
    switch (activeFilter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tools.filter(tool => new Date(tool.created_at) >= today).slice(0, 12);
      case 'new':
        return tools.slice(0, 12);
      case 'saved':
        return [...tools].sort(() => Math.random() - 0.5).slice(0, 12);
      case 'used':
        return [...tools].sort(() => Math.random() - 0.5).slice(0, 12);
      default:
        return [];
    }
  }, [activeFilter, tools]);

  return (
    <Layout>
      <Head>
        <title>Discover The Best AI Websites & Tools | Aitoonic</title>
        <meta 
          name="description" 
          content="Discover the best AI tools and websites. Browse 131+ AI tools across 61+ categories. Find the perfect AI solution for your needs." 
        />
        <meta 
          name="keywords" 
          content="AI tools, artificial intelligence, machine learning, AI websites, AI software, AI directory" 
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Discover The Best AI Websites & Tools | Aitoonic" />
        <meta property="og:description" content="Discover the best AI tools and websites. Browse 131+ AI tools across 61+ categories." />
        <meta property="og:image" content="https://aitoonic.com/og-image.jpg" />
        <meta property="og:url" content="https://aitoonic.com/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Discover The Best AI Websites & Tools | Aitoonic" />
        <meta name="twitter:description" content="Discover the best AI tools and websites. Browse 131+ AI tools across 61+ categories." />
        <meta name="twitter:image" content="https://aitoonic.com/og-image.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Aitoonic',
              description: 'Discover the best AI tools and websites',
              url: 'https://aitoonic.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://aitoonic.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header Section */}
        <section className="py-16 bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                Discover The Best AI Websites & Tools
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Discover the best AI tools directory. AI tools list & GPTs store are updated daily.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search AI Tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-16 py-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-lg"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                  { key: 'new', label: 'New', icon: Star },
                  { key: 'today', label: 'Today', icon: Calendar },
                  { key: 'saved', label: 'Most Saved', icon: Bookmark },
                  { key: 'used', label: 'Most Used', icon: TrendingUp }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key as any)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                      activeFilter === key
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-white/10 backdrop-blur-sm text-slate-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-16 bg-slate-800/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Latest AI Tools
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group card card-hover"
                >
                  <div className="aspect-16-9 rounded-t-xl overflow-hidden">
                    <Image
                      src={tool.image_url || 'https://images.unsplash.com/photo-1676277791608-ac54783d753b?auto=format&fit=crop&q=80&w=400'}
                      alt={tool.name}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={filteredTools.indexOf(tool) < 6}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="container mx-auto px-4">
            {categories.slice(0, 5).map((category) => {
              const categoryTools = tools.filter(tool => tool.category_id === category.id).slice(0, 6);
              
              if (categoryTools.length === 0) return null;

              return (
                <div key={category.id} className="mb-20">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {category.name}
                      </h2>
                      <p className="text-slate-400">{category.description}</p>
                    </div>
                    <Link
                      href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25"
                    >
                      <span>View All ({category.tool_count})</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {categoryTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group card card-hover"
                      >
                        <div className="aspect-16-9 rounded-t-xl overflow-hidden">
                          <Image
                            src={tool.image_url || 'https://images.unsplash.com/photo-1676277791608-ac54783d753b?auto=format&fit=crop&q=80&w=400'}
                            alt={tool.name}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-white text-sm mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-r from-primary-900/30 to-secondary-900/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Stay Updated</h2>
              <p className="text-slate-300 mb-8 text-lg">
                Get the latest AI tools and insights delivered to your inbox
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-medium whitespace-nowrap transition-all hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch categories and tools in parallel for better performance
    const [categoriesResponse, toolsResponse] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, description')
        .order('name')
        .limit(10),
      
      supabase
        .from('tools')
        .select('id, name, description, url, category_id, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(50)
    ]);

    // Process categories with tool counts
    const categoriesWithCounts = await Promise.all(
      (categoriesResponse.data || []).map(async (category) => {
        const { count } = await supabase
          .from('tools')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);
        
        return {
          ...category,
          tool_count: count || 0
        };
      })
    );

    const validCategories = categoriesWithCounts
      .filter(category => category.tool_count > 0)
      .sort((a, b) => b.tool_count - a.tool_count);

    return {
      props: {
        categories: validCategories,
        tools: toolsResponse.data || [],
        featuredTools: (toolsResponse.data || []).slice(0, 12)
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        categories: [],
        tools: [],
        featuredTools: []
      }
    };
  }
};