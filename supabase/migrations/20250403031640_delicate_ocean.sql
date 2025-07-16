/*
  # Fix Tools Schema

  1. Changes
    - Drop and recreate JSONB columns with proper defaults
    - Add type checking for JSONB columns
*/

-- Drop existing JSONB columns
ALTER TABLE tools 
DROP COLUMN IF EXISTS features,
DROP COLUMN IF EXISTS use_cases,
DROP COLUMN IF EXISTS pricing;

-- Add JSONB columns with proper defaults and constraints
ALTER TABLE tools 
ADD COLUMN features JSONB DEFAULT '[]'::jsonb CHECK (jsonb_typeof(features) = 'array'),
ADD COLUMN use_cases JSONB DEFAULT '[]'::jsonb CHECK (jsonb_typeof(use_cases) = 'array'),
ADD COLUMN pricing JSONB DEFAULT '[]'::jsonb CHECK (jsonb_typeof(pricing) = 'array');