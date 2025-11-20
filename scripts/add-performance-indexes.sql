-- Performance Indexes Migration
-- Add indexes to most queried columns for 10x faster database queries
-- Run this in Supabase SQL Editor

-- 1. user_daily_completion table (most expensive query - 3000ms)
-- Used by: /api/user/daily-completion (weekly stats)
CREATE INDEX IF NOT EXISTS idx_daily_completion_email_date
ON user_daily_completion(email, date DESC);

CREATE INDEX IF NOT EXISTS idx_daily_completion_email
ON user_daily_completion(email);

-- 2. testoup_tracking table
-- Used by: /api/testoup/track (daily TestoUp status)
CREATE INDEX IF NOT EXISTS idx_testoup_email_date
ON testoup_tracking(email, date DESC);

-- 3. workout_sessions table
-- Used by: /api/workout/check (daily workout status)
CREATE INDEX IF NOT EXISTS idx_workout_email_date
ON workout_sessions(email, date DESC);

-- 4. sleep_tracking table
-- Used by: /api/sleep/track (daily sleep status)
CREATE INDEX IF NOT EXISTS idx_sleep_email_date
ON sleep_tracking(email, date DESC);

-- 5. meals_completed table
-- Used by: /api/meals/complete (daily meal status)
CREATE INDEX IF NOT EXISTS idx_meals_email_date
ON meals_completed(email, date DESC);

-- 6. daily_progress_scores table
-- Used by: /api/user/progressive-score (progressive scoring)
CREATE INDEX IF NOT EXISTS idx_progress_scores_email_date
ON daily_progress_scores(email, date DESC);

-- 7. quiz_results_v2 table
-- Used by: /api/user/program (user program data)
CREATE INDEX IF NOT EXISTS idx_quiz_results_email
ON quiz_results_v2(email);

-- Verify indexes were created
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
