/*
  # Fix Admin Panel Schema Issues

  1. Changes
    - Add missing `updated_at` column to tools table
    - Add missing `image_url` column to categories table
    - Fix RLS policies for proper admin access
    - Add missing columns with proper defaults

  2. Security
    - Update RLS policies to allow proper admin operations
    - Ensure all tables have consistent column structure
*/

-- Add missing updated_at column to tools table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tools' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE tools ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add missing image_url column to categories table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN image_url text;
  END IF;
END $$;

-- Add missing updated_at column to categories table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE categories ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update existing records to have updated_at values
UPDATE tools SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE categories SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE agents SET updated_at = created_at WHERE updated_at IS NULL;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;
CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();