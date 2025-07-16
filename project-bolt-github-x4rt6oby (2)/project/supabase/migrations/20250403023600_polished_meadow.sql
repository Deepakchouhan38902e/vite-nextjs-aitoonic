/*
  # Add Blog Posts and AI Agents

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `author_id` (uuid, foreign key)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `slug` (text, unique)
      - `cover_image` (text)
    
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `capabilities` (text[])
      - `api_endpoint` (text)
      - `pricing_type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create blog_posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES auth.users(id),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  slug text UNIQUE NOT NULL,
  cover_image text
);

-- Create agents table
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  capabilities text[] NOT NULL DEFAULT '{}',
  api_endpoint text,
  pricing_type text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Allow public read access for active agents"
  ON agents
  FOR SELECT
  TO public
  USING (status = 'active');

-- Create policies for authenticated users to manage content
CREATE POLICY "Allow authenticated users to manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Allow authenticated users to manage agents"
  ON agents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO blog_posts (title, content, excerpt, slug, published_at, cover_image) VALUES
(
  'The Future of AI Agents in 2024',
  E'# The Future of AI Agents\n\nAI agents are revolutionizing how we work...',
  'Discover how AI agents are transforming the workplace and what to expect in 2024.',
  'future-of-ai-agents-2024',
  now(),
  'https://images.unsplash.com/photo-1677442136019-21780ecad995'
),
(
  'Getting Started with AI Tools',
  E'# Getting Started with AI Tools\n\nLearn how to leverage AI tools...',
  'A comprehensive guide to getting started with AI tools for beginners.',
  'getting-started-with-ai-tools',
  now(),
  'https://images.unsplash.com/photo-1676277791608-ac54783d753b'
);

INSERT INTO agents (name, description, capabilities, api_endpoint, pricing_type) VALUES
(
  'ContentGenius',
  'Advanced AI agent for content creation and optimization',
  ARRAY['Content Generation', 'SEO Optimization', 'Grammar Checking'],
  'https://api.example.com/contentgenius',
  'freemium'
),
(
  'DataAnalyst AI',
  'Intelligent data analysis and visualization agent',
  ARRAY['Data Analysis', 'Chart Generation', 'Trend Detection'],
  'https://api.example.com/dataanalyst',
  'paid'
);