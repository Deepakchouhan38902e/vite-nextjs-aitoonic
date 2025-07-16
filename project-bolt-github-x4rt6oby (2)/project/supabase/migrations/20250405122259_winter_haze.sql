/*
  # Add Favicon URL Column

  1. Changes
    - Add favicon_url column to tools table
    - Add favicon_url column to agents table

  2. Description
    - Allows tools and agents to have custom favicons
    - Improves branding and recognition
*/

-- Add favicon_url column to tools table
ALTER TABLE tools
ADD COLUMN IF NOT EXISTS favicon_url text;

-- Add favicon_url column to agents table
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS favicon_url text;