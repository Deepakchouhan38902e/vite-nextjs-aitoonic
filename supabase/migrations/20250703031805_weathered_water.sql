/*
  # Add How to Use Section to Tools

  1. Changes
    - Add how_to_use column to tools table
    - This allows each tool to have its own "How to Use" instructions

  2. Description
    - Allows tools to have custom usage instructions
    - Helps users understand how to use each specific tool
*/

-- Add how_to_use column to tools table
ALTER TABLE tools
ADD COLUMN IF NOT EXISTS how_to_use text;

-- Update existing tools with default how to use content
UPDATE tools
SET how_to_use = 'Visit the tool website and follow their getting started guide to begin using this AI tool.'
WHERE how_to_use IS NULL;