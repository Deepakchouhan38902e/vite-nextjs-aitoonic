/*
  # Update Categories RLS Policies

  1. Security Changes
    - Add RLS policies for authenticated users to manage categories
    - Allow authenticated users to insert, update, and delete categories
    - Maintain public read access

  2. Changes
    - Add new RLS policies for CRUD operations on categories table
*/

-- Add policy for authenticated users to insert categories
CREATE POLICY "Allow authenticated users to insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add policy for authenticated users to update categories
CREATE POLICY "Allow authenticated users to update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add policy for authenticated users to delete categories
CREATE POLICY "Allow authenticated users to delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);