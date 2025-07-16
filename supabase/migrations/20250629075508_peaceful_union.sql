/*
  # Update Agents Schema for New Fields

  1. Changes
    - Add agent_features column for simple feature list
    - Add is_featured column for featured status
    - Add is_verified column for verification status
    - Add image_alt column for image alt text
    - Remove old complex fields that are no longer needed

  2. New Columns
    - agent_features (text[]) - Simple array of feature strings
    - is_featured (boolean) - Whether the agent is featured
    - is_verified (boolean) - Whether the agent is verified (blue tick)
    - image_alt (text) - Alt text for the image
*/

-- Add new columns to agents table
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS agent_features text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS image_alt text;

-- Add image_alt column to tools and categories tables as well
ALTER TABLE tools
ADD COLUMN IF NOT EXISTS image_alt text;

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image_alt text;

-- Update existing agents with default values
UPDATE agents
SET 
  agent_features = COALESCE(agent_features, '{}'),
  is_featured = COALESCE(is_featured, false),
  is_verified = COALESCE(is_verified, false)
WHERE agent_features IS NULL OR is_featured IS NULL OR is_verified IS NULL;