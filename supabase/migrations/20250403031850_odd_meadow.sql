/*
  # Fix Tools JSONB Column Names

  1. Changes
    - Rename JSONB columns to match frontend naming
    - Add proper type checking and defaults
*/

-- Drop existing JSONB columns
ALTER TABLE tools 
DROP COLUMN IF EXISTS features,
DROP COLUMN IF EXISTS use_cases,
DROP COLUMN IF EXISTS pricing;

-- Add JSONB columns with proper naming and constraints
ALTER TABLE tools 
ADD COLUMN features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN "useCases" JSONB DEFAULT '[]'::jsonb,
ADD COLUMN pricing JSONB DEFAULT '[]'::jsonb;