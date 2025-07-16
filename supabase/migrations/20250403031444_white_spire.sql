/*
  # Update Tools Schema

  1. Changes
    - Add RLS policies for tools table
    - Add JSONB columns for features, use cases, and pricing
    - Update existing tools table structure

  2. Security
    - Enable RLS policies for authenticated users to manage tools
*/

-- Add new columns to tools table
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS use_cases JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '[]';

-- Add RLS policies for tools
CREATE POLICY "Allow authenticated users to insert tools"
  ON tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tools"
  ON tools
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete tools"
  ON tools
  FOR DELETE
  TO authenticated
  USING (true);