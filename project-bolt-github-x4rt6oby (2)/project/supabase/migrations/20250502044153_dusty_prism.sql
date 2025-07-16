/*
  # Add SEO Fields
  
  1. New Columns
    - `seo_title` (text)
    - `seo_description` (text)
    - Added to:
      - tools
      - agents
      - categories

  2. Description
    - Allows setting custom SEO metadata for each item
    - Helps with search engine optimization
    - Prevents duplicate titles/descriptions
*/

-- Add SEO fields to tools table
ALTER TABLE tools
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text;

-- Add SEO fields to agents table
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text;

-- Add SEO fields to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text;