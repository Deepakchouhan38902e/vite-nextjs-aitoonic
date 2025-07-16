/*
  # Update RLS policies for admin access

  1. Security Updates
    - Add policies for authenticated users to manage all tables
    - Allow authenticated users to perform CRUD operations on categories, tools, and agents
    - Ensure proper admin access while maintaining security

  2. Policy Changes
    - Categories: Allow authenticated users to insert, update, delete, and select
    - Tools: Allow authenticated users to insert, update, delete, and select  
    - Agents: Allow authenticated users to insert, update, delete, and select
*/

-- Categories table policies
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON categories;

CREATE POLICY "Allow all operations for authenticated users" ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access for all users" ON categories
  FOR SELECT
  TO anon
  USING (true);

-- Tools table policies
DROP POLICY IF EXISTS "Enable read access for all users" ON tools;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tools;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON tools;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON tools;

CREATE POLICY "Allow all operations for authenticated users" ON tools
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access for all users" ON tools
  FOR SELECT
  TO anon
  USING (true);

-- Agents table policies
DROP POLICY IF EXISTS "Enable read access for all users" ON agents;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON agents;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON agents;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON agents;

CREATE POLICY "Allow all operations for authenticated users" ON agents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access for all users" ON agents
  FOR SELECT
  TO anon
  USING (true);