-- Migration: Add dietary_preference column to users table
-- Purpose: Store user's dietary preference for meal plan personalization
-- Created: 2025-11-12

-- Add dietary_preference column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS dietary_preference TEXT DEFAULT 'omnivor' NOT NULL;

-- Add check constraint to ensure only valid dietary preferences
ALTER TABLE users
ADD CONSTRAINT check_dietary_preference
CHECK (dietary_preference IN ('omnivor', 'pescatarian', 'vegetarian', 'vegan'));

-- Add comment to column for documentation
COMMENT ON COLUMN users.dietary_preference IS 'User dietary preference: omnivor (default), pescatarian, vegetarian, or vegan';

-- Create index for faster queries filtering by dietary preference
CREATE INDEX IF NOT EXISTS idx_users_dietary_preference ON users(dietary_preference);

-- Add dietary_preference to quiz_results table as well
-- This allows us to track what preference was set at quiz completion
ALTER TABLE quiz_results
ADD COLUMN IF NOT EXISTS dietary_preference TEXT DEFAULT 'omnivor' NOT NULL;

-- Add check constraint to quiz_results
ALTER TABLE quiz_results
ADD CONSTRAINT check_quiz_results_dietary_preference
CHECK (dietary_preference IN ('omnivor', 'pescatarian', 'vegetarian', 'vegan'));

-- Add comment to quiz_results column
COMMENT ON COLUMN quiz_results.dietary_preference IS 'User dietary preference captured during quiz';

-- Create index on quiz_results for analytics
CREATE INDEX IF NOT EXISTS idx_quiz_results_dietary_preference ON quiz_results(dietary_preference);
