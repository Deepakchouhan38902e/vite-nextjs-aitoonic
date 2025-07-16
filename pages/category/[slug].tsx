import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category_id: string;
  image_url: string;
}

interface CategoryViewProps {
  category: Category | null;
  tools: Tool[];
}

export default function CategoryView({ category, tools }: CategoryViewProps) {
  if (!category) {
    return (
      <Layout>
        <Head>
          <title>Category Not Found | Aitoonic</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        
        <div className="min-h-screen bg-royal-dark py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
              <p className="text-gray-400 mb-8">The category you're looking for doesn't exist.</p>
              <Link 
                href="/categories"
                className="inline-flex items-center text-royal-gold hover:text-royal-gold/80"
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
        <title>{category.name} AI Tools | Aitoonic</title>
        <meta name="description" content={category.description} />
        <meta property="og:title" content={`${category.name} AI Tools | Aitoonic`} />
        <meta property="og:description" content={category.description} />
        <meta property="og:type" content="website" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            <Link href="/categories" className="text-gray-400 hover:text-white">Categories</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-300">{category.name}</span>
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
                href={`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-royal-dark-card rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={tool.image_url || 'https://images.unsplash.com/photo-1676277791608-ac54783d753b?auto=format&fit=crop&q=80&w=400'}
                    alt={tool.name}
                    fill
                    className="object-cover"
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
                href="/categories"
                className="inline-flex items-center bg-royal-gold text-royal-dark px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                Browse Other Categories
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params!;
  
  try {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('*')
      .ilike('name', (slug as string).replace(/-/g, ' '))
      .single();
    
    if (!categoryData) {
      return {
        props: {
          category: null,
          tools: []
        }
      };
    }

    const { data: toolsData } = await supabase
      .from('tools')
      .select('*')
      .eq('category_id', categoryData.id)
      .order('created_at', { ascending: false });

    return {
      props: {
        category: categoryData,
        tools: toolsData || []
      }
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      props: {
        category: null,
        tools: []
      }
    };
  }
};