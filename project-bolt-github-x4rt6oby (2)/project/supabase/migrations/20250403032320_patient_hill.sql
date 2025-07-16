/*
  # Update Tools with Default Values and Imgur Images

  1. Changes
    - Add default values for features, useCases, and pricing
    - Update image URLs to use Imgur
*/

-- Update existing tools with default features, useCases, and pricing
UPDATE tools
SET 
  features = '[
    {
      "title": "Natural Language Understanding",
      "description": "Advanced comprehension of context and nuanced language"
    },
    {
      "title": "Content Generation",
      "description": "Create high-quality text content across various formats"
    },
    {
      "title": "Code Assistance",
      "description": "Help with programming tasks and code explanation"
    }
  ]'::jsonb,
  "useCases" = '[
    {
      "title": "Content Creation",
      "description": "Generate articles, blog posts, and marketing copy"
    },
    {
      "title": "Programming Support",
      "description": "Get help with coding tasks and debugging"
    },
    {
      "title": "Research Assistance",
      "description": "Analyze information and summarize findings"
    }
  ]'::jsonb,
  pricing = '[
    {
      "plan": "Free",
      "price": "$0",
      "features": ["Basic features", "Limited requests", "Standard response time"]
    },
    {
      "plan": "Plus",
      "price": "$20/month",
      "features": ["Priority access", "Faster response time", "Advanced features"]
    },
    {
      "plan": "Enterprise",
      "price": "Custom",
      "features": ["Custom solutions", "Dedicated support", "API access"]
    }
  ]'::jsonb,
  image_url = CASE name
    WHEN 'GPT Writer' THEN 'https://i.imgur.com/ZXqf6Kx.png'
    WHEN 'CopyMaster AI' THEN 'https://i.imgur.com/R9oVJPh.png'
    WHEN 'DreamCanvas' THEN 'https://i.imgur.com/L8yYdFW.png'
    WHEN 'PixelGenius' THEN 'https://i.imgur.com/mK3gFPz.png'
    ELSE image_url
  END
WHERE features IS NULL OR "useCases" IS NULL OR pricing IS NULL OR image_url IS NULL;

-- Update agents with Imgur images
UPDATE agents
SET image_url = CASE name
  WHEN 'ContentGenius' THEN 'https://i.imgur.com/NXyUxX7.png'
  WHEN 'DataAnalyst AI' THEN 'https://i.imgur.com/YwJ7tMJ.png'
  ELSE image_url
END
WHERE image_url IS NULL;