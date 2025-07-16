import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SitemapItem {
  title: string;
  path: string;
}

interface Category {
  id: string;
  name: string;
}

interface Tool {
  id: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
}

function Sitemap() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [
        { data: categoriesData },
        { data: toolsData },
        { data: agentsData }
      ] = await Promise.all([
        supabase.from('categories').select('id, name'),
        supabase.from('tools').select('id, name'),
        supabase.from('agents').select('id, name')
      ]);

      if (categoriesData) setCategories(categoriesData);
      if (toolsData) setTools(toolsData);
      if (agentsData) setAgents(agentsData);
    }

    fetchData();
  }, []);

  const mainPages: SitemapItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Categories', path: '/categories' },
    { title: 'AI Agents', path: '/ai-agent' },
    { title: 'About Us', path: '/about' },
    { title: 'Contact', path: '/contact' },
    { title: 'Terms & Conditions', path: '/terms' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Advertise With Us', path: '/advertise' },
    { title: 'Affiliate Disclaimer', path: '/affiliate' },
  ];

  return (
    <div className="min-h-screen bg-royal-dark py-20">
      <Helmet>
        <title>Sitemap | Aitoonic.com</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Sitemap</h1>
          
          <div className="space-y-12">
            {/* Main Pages */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Main Pages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-royal-gold" />
                    <span>{page.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-royal-gold" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h2 className="text-2xl font-bold mb-4">AI Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/ai/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-royal-gold" />
                    <span>{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Agents */}
            <div>
              <h2 className="text-2xl font-bold mb-4">AI Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <Link
                    key={agent.id}
                    to={`/ai-agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-royal-gold" />
                    <span>{agent.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sitemap;