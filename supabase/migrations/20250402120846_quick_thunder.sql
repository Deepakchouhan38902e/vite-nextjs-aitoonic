/*
  # AI Tools Directory Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `tools`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `url` (text)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  url text,
  category_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for tools"
  ON tools
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO categories (name, description) VALUES
  ('Text Generation', 'AI tools for generating and manipulating text content'),
  ('Image Creation', 'AI-powered tools for creating and editing images');

INSERT INTO tools (name, description, url, category_id) VALUES
  ('GPT Writer', 'Advanced AI writing assistant', 'https://example.com/gpt-writer', (SELECT id FROM categories WHERE name = 'Text Generation')),
  ('CopyMaster AI', 'AI-powered copywriting tool', 'https://example.com/copymaster', (SELECT id FROM categories WHERE name = 'Text Generation')),
  ('DreamCanvas', 'Create stunning artwork with AI', 'https://example.com/dreamcanvas', (SELECT id FROM categories WHERE name = 'Image Creation')),
  ('PixelGenius', 'AI image enhancement and generation', 'https://example.com/pixelgenius', (SELECT id FROM categories WHERE name = 'Image Creation'));