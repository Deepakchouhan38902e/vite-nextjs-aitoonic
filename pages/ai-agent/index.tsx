import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Bot, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';

interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  api_endpoint: string;
  pricing_type: string;
  status: string;
  image_url: string;
}

interface AgentsProps {
  agents: Agent[];
}

export default function Agents({ agents }: AgentsProps) {
  return (
    <Layout>
      <Head>
        <title>AI Agents Marketplace | Aitoonic</title>
        <meta 
          name="description" 
          content="Discover powerful AI agents that can automate your workflows and enhance productivity"
        />
        <meta property="og:title" content="AI Agents Marketplace | Aitoonic" />
        <meta property="og:description" content="Discover powerful AI agents that can automate your workflows and enhance productivity" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'AI Agents Marketplace',
              description: 'Discover powerful AI agents that can automate your workflows and enhance productivity',
              url: 'https://aitoonic.com/ai-agent',
              hasPart: agents.map(agent => ({
                '@type': 'Product',
                name: agent.name,
                description: agent.description,
                url: `https://aitoonic.com/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`
              }))
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-royal-dark">
        {/* Hero Section */}
        <section className="royal-gradient py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text text-center">
              AI Agents Marketplace
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto text-center">
              Discover powerful AI agents that can automate your workflows and enhance productivity
            </p>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-royal-dark-card rounded-2xl overflow-hidden card-hover border border-royal-dark-lighter group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <Image
                    src={agent.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600'}
                    alt={agent.name}
                    width={600}
                    height={337}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <Bot className="w-10 h-10 text-royal-gold mb-4" />
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-royal-gold transition-colors">
                    {agent.name}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {agent.description}
                  </p>
                  
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-300 mb-2">
                      Capabilities
                    </h3>
                    <ul className="space-y-1">
                      {agent.capabilities.slice(0, 3).map((capability, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-400">
                          <Check className="w-3 h-3 text-royal-gold mr-1 flex-shrink-0" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-royal-dark text-royal-gold">
                      {agent.pricing_type}
                    </span>
                    <span className="inline-flex items-center text-royal-gold group-hover:text-royal-gold/80 text-sm font-medium">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {agents.length === 0 && (
            <div className="text-center py-20">
              <Bot className="w-16 h-16 text-royal-gold mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No AI Agents Available</h2>
              <p className="text-gray-400 mb-8">Check back soon for new AI agents.</p>
              <Link
                href="/"
                className="inline-flex items-center bg-royal-gold text-royal-dark px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                Explore AI Tools
              </Link>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { data: agents } = await supabase
      .from('agents')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    return {
      props: {
        agents: agents || []
      }
    };
  } catch (error) {
    console.error('Error fetching agents:', error);
    return {
      props: {
        agents: []
      }
    };
  }
};