/*
  # Add Search Terms Tracking

  1. New Table
    - `search_terms`
      - `id` (uuid, primary key)
      - `term` (text, unique)
      - `count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage terms
*/

CREATE TABLE search_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text UNIQUE NOT NULL,
  count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE search_terms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access for search terms"
  ON search_terms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage search terms"
  ON search_terms
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update search terms
CREATE OR REPLACE FUNCTION upsert_search_term(search_term text)
RETURNS void AS $$
BEGIN
  INSERT INTO search_terms (term)
  VALUES (lower(search_term))
  ON CONFLICT (term)
  DO UPDATE SET
    count = search_terms.count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;