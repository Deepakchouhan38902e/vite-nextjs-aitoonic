/*
  # Add image_url column to tools and agents tables

  1. Changes
    - Add image_url column to tools table
    - Add image_url column to agents table
*/

-- Add image_url column to tools table
ALTER TABLE tools
ADD COLUMN IF NOT EXISTS image_url text;

-- Add image_url column to agents table
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS image_url text;