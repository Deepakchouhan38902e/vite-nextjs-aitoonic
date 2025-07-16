/*
  # Add How to Use Section

  1. New Table
    - `how_to_use`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

CREATE TABLE how_to_use (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE how_to_use ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for active how to use"
  ON how_to_use
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create policies for authenticated users to manage content
CREATE POLICY "Allow authenticated users to manage how to use"
  ON how_to_use
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_how_to_use_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_how_to_use_updated_at
    BEFORE UPDATE ON how_to_use
    FOR EACH ROW
    EXECUTE FUNCTION update_how_to_use_updated_at();

-- Insert default how to use content
INSERT INTO how_to_use (title, content) VALUES
(
  'How to Use Aitoonic',
  E'# How to Use Aitoonic\n\n## Getting Started\n\n1. **Browse Categories**: Explore our comprehensive collection of AI tools organized by category.\n\n2. **Search Tools**: Use our powerful search feature to find specific AI tools or browse by keywords.\n\n3. **Filter Results**: Use our filters to narrow down tools by pricing, features, or popularity.\n\n4. **Compare Tools**: Compare different AI tools side by side to find the best fit for your needs.\n\n5. **Read Reviews**: Check out detailed reviews and ratings from our community.\n\n## Features\n\n- **Comprehensive Directory**: Access to 131+ AI tools across 61+ categories\n- **Daily Updates**: New tools added regularly\n- **Expert Reviews**: In-depth analysis of each tool\n- **Comparison Tools**: Side-by-side feature comparisons\n- **Community Ratings**: Real user feedback and ratings\n\n## Tips for Success\n\n- Start with free tools to test functionality\n- Read user reviews before making decisions\n- Compare similar tools to find the best value\n- Check pricing plans carefully\n- Look for tools with good customer support'
);