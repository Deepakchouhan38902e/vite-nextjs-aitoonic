import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

interface Category {
  id: string;
  name: string;
  description: string;
  tool_count: number;
}

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <Layout>
      <Head>
        <title>AI Tool Categories | Aitoonic</title>
        <meta 
          name="description" 
          content="Browse our comprehensive collection of AI tools by category. Find the perfect tools for your needs."
        />
        <meta property="og:title" content="AI Tool Categories | Aitoonic" />
        <meta property="og:description" content="Browse our comprehensive collection of AI tools by category." />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'AI Tool Categories',
              description: 'Browse our comprehensive collection of AI tools by category',
              url: 'https://aitoonic.com/categories',
              hasPart: categories.map(category => ({
                '@type': 'Thing',
                name: category.name,
                description: category.description,
                url: `https://aitoonic.com/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`
              }))
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
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
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name, description')
      .order('name');

    if (!categoriesData) {
      return {
        props: {
          categories: []
        },
        revalidate: 3600 // Revalidate every hour
      };
    }

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

    return {
      props: {
        categories: validCategories
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: []
      },
      revalidate: 3600
    };
  }
};