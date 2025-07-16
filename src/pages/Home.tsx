import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, Calendar, TrendingUp, Bookmark, Users, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { LazyImage } from '../components/LazyImage';
import { usePerformance } from '../hooks/usePerformance';

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
  category_name?: string;
}

interface SearchResult {
  type: 'tool' | 'category';
  item: Tool | Category;
}

// Optimized loading skeleton components
const ToolSkeleton = React.memo(() => (
  <div className="group card card-hover animate-pulse">
    <div className="aspect-16-9 rounded-t-xl overflow-hidden bg-slate-700"></div>
    <div className="p-4">
      <div className="h-4 bg-slate-700 rounded mb-2"></div>
      <div className="h-3 bg-slate-600 rounded w-3/4"></div>
    </div>
  </div>
));

const CategorySkeleton = React.memo(() => (
  <div className="mb-20 animate-pulse">
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="h-8 bg-slate-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-slate-600 rounded w-64"></div>
      </div>
      <div className="h-12 bg-slate-700 rounded w-32"></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ToolSkeleton key={i} />
      ))}
    </div>
  </div>
));

// Memoized tool card component
const ToolCard = React.memo(({ tool, priority = false }: { tool: Tool; priority?: boolean }) => (
  <Link
    to={`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
    className="group card card-hover will-change-transform"
  >
    <LazyImage
      src={tool.image_url || 'https://images.unsplash.com/photo-1676277791608-ac54783d753b?auto=format&fit=crop&q=80&w=400'}
      alt={tool.name}
      priority={priority}
      className="aspect-16-9 rounded-t-xl overflow-hidden"
    />
    <div className="p-4">
      <h3 className="font-semibold text-white text-sm mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
        {tool.name}
      </h3>
      <p className="text-xs text-slate-400 line-clamp-2">
        {tool.description}
      </p>
    </div>
  </Link>
));

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'today' | 'new' | 'saved' | 'used'>('new');
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [toolsLoading, setToolsLoading] = useState(true);

  // Use performance hook
  usePerformance();

  // Memoize filtered tools to prevent unnecessary recalculations
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

  // Optimized data fetching with parallel requests
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch categories and tools in parallel for better performance
        const [categoriesResponse, toolsResponse] = await Promise.all([
          // Optimized categories query
          supabase
            .from('categories')
            .select('id, name, description')
            .order('name')
            .limit(10), // Limit categories for initial load
          
          // Optimized tools query - limit initial load for better LCP
          supabase
            .from('tools')
            .select('id, name, description, url, category_id, image_url, created_at')
            .order('created_at', { ascending: false })
            .limit(50) // Reduced limit for faster initial load
        ]);

        // Process categories
        if (categoriesResponse.data) {
          // Get tool counts separately for better performance
          const categoriesWithCounts = await Promise.all(
            categoriesResponse.data.map(async (category) => {
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
          
          setCategories(validCategories);
          setCategoriesLoading(false);
        }

        // Process tools
        if (toolsResponse.data) {
          setTools(toolsResponse.data);
          setToolsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Optimized search with debouncing
  const debouncedSearch = useCallback(
    useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (term: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (term.trim() === '') {
            setSearchResults([]);
            return;
          }

          const searchTerm = term.toLowerCase();
          const results: SearchResult[] = [];

          // Search in tools (limit for performance)
          tools.slice(0, 20).forEach(tool => {
            if (tool.name.toLowerCase().includes(searchTerm) || 
                tool.description.toLowerCase().includes(searchTerm)) {
              results.push({ type: 'tool', item: tool });
            }
          });

          // Search in categories
          categories.forEach(category => {
            if (category.name.toLowerCase().includes(searchTerm) || 
                category.description?.toLowerCase().includes(searchTerm)) {
              results.push({ type: 'category', item: category });
            }
          });

          setSearchResults(results.slice(0, 6)); // Limit to 6 results
        }, 300);
      };
    }, [tools, categories]),
    [tools, categories]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleResultClick = useCallback((result: SearchResult) => {
    setShowResults(false);
    setSearchTerm('');

    if (result.type === 'tool') {
      navigate(`/ai/${result.item.name.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      navigate(`/category/${result.item.name.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }, [navigate]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <SEO
        title="Discover The Best AI Websites & Tools | Aitoonic"
        description="Discover the best AI tools and websites. Browse 131+ AI tools across 61+ categories. Find the perfect AI solution for your needs."
        keywords="AI tools, artificial intelligence, machine learning, AI websites, AI software, AI directory"
      />

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
                <div id="search-container" className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search AI Tools..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="w-full pl-12 pr-16 py-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-lg"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>

                  {/* Search Results Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50">
                      {searchResults.map((result, index) => (
                        <button
                          key={`${result.type}-${index}`}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-primary-50 transition-colors text-left"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                            {result.type === 'tool' ? '🔧' : '📁'}
                          </div>
                          <div>
                            <h4 className="text-slate-900 font-medium">{result.item.name}</h4>
                            <p className="text-sm text-slate-500 line-clamp-1">
                              {result.item.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
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
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all will-change-transform ${
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
        {(filteredTools.length > 0 || toolsLoading) && (
          <section className="py-16 bg-slate-800/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {activeFilter === 'today' && 'Today\'s New Tools'}
                {activeFilter === 'new' && 'Latest AI Tools'}
                {activeFilter === 'saved' && 'Most Saved Tools'}
                {activeFilter === 'used' && 'Most Used Tools'}
              </h2>
              
              {toolsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ToolSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {filteredTools.map((tool, index) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      priority={index < 6} // First 6 images load with priority
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="container mx-auto px-4">
            {categoriesLoading ? (
              <div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <CategorySkeleton key={i} />
                ))}
              </div>
            ) : (
              categories.slice(0, 5).map((category) => { // Limit to 5 categories for initial load
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
                        to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25 will-change-transform"
                      >
                        <span>View All ({category.tool_count})</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {categoryTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
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
                  className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-medium whitespace-nowrap transition-all hover:shadow-lg hover:shadow-primary-500/25 will-change-transform"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;