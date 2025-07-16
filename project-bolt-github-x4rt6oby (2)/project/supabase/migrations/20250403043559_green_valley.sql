/*
  # Add Agent Stats Columns

  1. Changes
    - Add columns for tracking agent statistics
    - Set default values for new columns
    - Update existing agents with default stats

  2. New Columns
    - is_available_24_7 (boolean)
    - user_count (integer)
    - has_fast_response (boolean)
    - is_secure (boolean)
*/

-- Add new columns with default values
ALTER TABLE agents
ADD COLUMN is_available_24_7 boolean DEFAULT false,
ADD COLUMN user_count integer DEFAULT 0,
ADD COLUMN has_fast_response boolean DEFAULT false,
ADD COLUMN is_secure boolean DEFAULT false;

-- Update existing agents with default values
UPDATE agents
SET 
  is_available_24_7 = true,
  user_count = 5000,
  has_fast_response = true,
  is_secure = true;