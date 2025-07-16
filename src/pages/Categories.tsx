import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  description: string;
  seo_title?: string;
  seo_description?: string;
}

interface CategoryWithCount {
  id: string;
  name: string;
  description: string;
  seo_title?: string;
  seo_description?: string;
  tool_count: number;
}

function Categories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const { data: categoriesData, error } = await supabase
          .from('categories')
          .select('id, name, description, seo_title, seo_description')
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }

        if (categoriesData) {
          // Get tool counts for each category
          const categoriesWithCounts = await Promise.all(
            categoriesData.map(async (category) => {
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
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Tool Categories | Aitoonic.com</title>
        <meta 
          name="description" 
          content="Browse our comprehensive collection of AI tools by category. Find the perfect tools for your needs."
        />
      </Helmet>

      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-300">Categories</span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Browse AI Tools by Category
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover specialized AI tools across different categories to enhance your workflow
            </p>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-royal-dark-card rounded-2xl p-8 border border-royal-dark-lighter animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-royal-dark rounded-xl">
                      <div className="w-8 h-8 bg-slate-600 rounded"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-slate-600 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-6"></div>
                  <div className="h-4 bg-slate-600 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-royal-dark-card rounded-2xl p-8 border border-royal-dark-lighter hover:border-royal-gold group transition-all"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-royal-dark rounded-xl">
                      <Sparkles className="w-8 h-8 text-royal-gold" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-royal-gold transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-gray-400">
                        {category.tool_count} {category.tool_count === 1 ? 'Tool' : 'Tools'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-royal-gold group-hover:text-royal-gold/80 font-medium">
                    Browse Tools
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-royal-gold mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No Categories Available</h2>
              <p className="text-gray-400 mb-8">Categories will appear here once tools are added.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Categories;