-- Migration: Add program_start_date to quiz_results_v2
-- This allows users to restart their 30-day cycle without changing created_at
-- Run this in Supabase SQL Editor

-- Add program_start_date column to quiz_results_v2
ALTER TABLE quiz_results_v2
ADD COLUMN IF NOT EXISTS program_start_date TIMESTAMP WITH TIME ZONE;

-- Set default value to created_at for existing records
UPDATE quiz_results_v2
SET program_start_date = created_at
WHERE program_start_date IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_v2_program_start_date
ON quiz_results_v2(program_start_date);

COMMENT ON COLUMN quiz_results_v2.program_start_date IS 'Start date of the current program cycle. Defaults to created_at, updated when user restarts cycle.';

-- After running this migration, you can safely drop the users table:
-- DROP TABLE IF EXISTS users CASCADE;
