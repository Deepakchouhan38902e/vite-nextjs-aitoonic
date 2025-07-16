/*
  # Update Agents Table Structure

  1. Changes
    - Add default values for capabilities array
    - Add RLS policies for authenticated users
    - Add status column with default value
    - Add image_url column

  2. Security
    - Add policies for authenticated users to manage agents
*/

-- Ensure capabilities has a default empty array
ALTER TABLE agents
ALTER COLUMN capabilities SET DEFAULT '{}';

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'status'
  ) THEN
    ALTER TABLE agents ADD COLUMN status text NOT NULL DEFAULT 'active';
  END IF;
END $$;

-- Add RLS policies for agents
CREATE POLICY "Allow authenticated users to insert agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete agents"
  ON agents
  FOR DELETE
  TO authenticated
  USING (true);

-- Update existing agents with default values
UPDATE agents
SET 
  capabilities = COALESCE(capabilities, '{}'),
  status = COALESCE(status, 'active'),
  image_url = CASE name
    WHEN 'ContentGenius' THEN 'https://i.imgur.com/NXyUxX7.png'
    WHEN 'DataAnalyst AI' THEN 'https://i.imgur.com/YwJ7tMJ.png'
    ELSE COALESCE(image_url, 'https://i.imgur.com/NXyUxX7.png')
  END
WHERE capabilities IS NULL OR status IS NULL OR image_url IS NULL;