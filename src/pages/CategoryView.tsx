import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { generateCategorySchema } from '../utils/schema';
import { LazyImage } from '../components/LazyImage';

interface Category {
  id: string;
  name: string;
  description: string;
  seo_title?: string;
  seo_description?: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category_id: string;
  image_url: string;
}

function CategoryView() {
  const { name } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        if (name === 'all') {
          // Show all tools
          const { data: toolsData, error } = await supabase
            .from('tools')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching tools:', error);
            return;
          }
          
          if (toolsData) {
            setTools(toolsData);
            setCategory({
              id: 'all',
              name: 'All Tools',
              description: 'Browse all available AI tools in our directory'
            });
          }
        } else {
          // Show specific category
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('*')
            .ilike('name', name?.replace(/-/g, ' ') || '')
            .single();
          
          if (categoryError) {
            console.error('Error fetching category:', categoryError);
            return;
          }
          
          if (categoryData) {
            setCategory(categoryData);
            
            const { data: toolsData, error: toolsError } = await supabase
              .from('tools')
              .select('*')
              .eq('category_id', categoryData.id)
              .order('created_at', { ascending: false });
            
            if (toolsError) {
              console.error('Error fetching tools:', toolsError);
              return;
            }
            
            if (toolsData) {
              setTools(toolsData);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-8"></div>
            <div className="h-12 bg-slate-700 rounded w-96 mb-4"></div>
            <div className="h-6 bg-slate-600 rounded w-full max-w-2xl mb-12"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-royal-dark-card rounded-xl overflow-hidden">
                  <div className="aspect-square bg-slate-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
            <p className="text-gray-400 mb-8">The category you're looking for doesn't exist.</p>
            <Link 
              to="/categories"
              className="inline-flex items-center text-royal-gold hover:text-royal-gold/80"
            >
              <ChevronRight className="w-5 h-5 mr-2" />
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {category && (
        <SEO
          title={category.seo_title || `${category.name} AI Tools | Aitoonic`}
          description={category.seo_description || category.description}
          type="website"
          schema={generateCategorySchema(category, tools)}
        />
      )}

      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link to="/categories" className="text-gray-400 hover:text-white">Categories</Link>
            {name !== 'all' && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <span className="text-gray-300">{category.name}</span>
              </>
            )}
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              {category.name}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-royal-dark-card rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={tool.image_url || 'https://images.unsplash.com/photo-1676277791608-ac54783d753b?auto=format&fit=crop&q=80&w=400'}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-royal-gold transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {tools.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-white mb-4">No Tools Found</h2>
              <p className="text-gray-400 mb-8">This category doesn't have any tools yet.</p>
              <Link
                to="/categories"
                className="inline-flex items-center bg-royal-gold text-royal-dark px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                Browse Other Categories
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CategoryView;