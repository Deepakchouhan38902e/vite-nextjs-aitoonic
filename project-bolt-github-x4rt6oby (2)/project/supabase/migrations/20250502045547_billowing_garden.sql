/*
  # Add SEO Fields
  
  1. Changes
    - Add SEO title and description fields to tools, agents, and categories tables
    - Set character limits for SEO fields
*/

-- Add SEO fields to tools table
ALTER TABLE tools
ADD COLUMN IF NOT EXISTS seo_title varchar(60),
ADD COLUMN IF NOT EXISTS seo_description varchar(160);

-- Add SEO fields to agents table
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS seo_title varchar(60),
ADD COLUMN IF NOT EXISTS seo_description varchar(160);

-- Add SEO fields to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS seo_title varchar(60),
ADD COLUMN IF NOT EXISTS seo_description varchar(160);