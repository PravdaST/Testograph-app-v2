-- Performance Indexes Migration (FIXED)
-- Add indexes to most queried columns for 10x faster database queries
-- Run this in Supabase SQL Editor

-- 1. user_daily_completion table (weekly completion stats)
-- Used by: /api/user/daily-completion (weekly stats)
CREATE INDEX IF NOT EXISTS idx_user_daily_completion_email_date
ON user_daily_completion(email, date DESC);

CREATE INDEX IF NOT EXISTS idx_user_daily_completion_email
ON user_daily_completion(email);

-- 2. testoup_tracking table
-- Used by: /api/testoup/track (daily TestoUp status)
CREATE INDEX IF NOT EXISTS idx_testoup_tracking_email_date
ON testoup_tracking(email, date DESC);

-- 3. workout_sessions table
-- Used by: /api/workout/check (daily workout status)
CREATE INDEX IF NOT EXISTS idx_workout_sessions_email_date
ON workout_sessions(email, date DESC);

-- 4. sleep_tracking table
-- Used by: /api/sleep/track (daily sleep status)
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_email_date
ON sleep_tracking(email, date DESC);

-- 5. meal_completions table (FIXED: was meals_completed)
-- Used by: /api/meals/complete (daily meal status)
CREATE INDEX IF NOT EXISTS idx_meal_completions_email_date
ON meal_completions(email, date DESC);

-- 6. daily_progress_scores table
-- Used by: /api/user/progressive-score (progressive scoring)
CREATE INDEX IF NOT EXISTS idx_daily_progress_scores_email_date
ON daily_progress_scores(email, date DESC);

-- 7. quiz_results_v2 table
-- Used by: /api/user/program (user program data)
CREATE INDEX IF NOT EXISTS idx_quiz_results_v2_email
ON quiz_results_v2(email);

-- 8. workout_exercise_sets table (bonus optimization)
-- Used by: /api/workout/sets (exercise tracking)
CREATE INDEX IF NOT EXISTS idx_workout_exercise_sets_email_date
ON workout_exercise_sets(email, date DESC);

-- 9. testoup_inventory table (bonus optimization)
-- Used by: /api/testoup/inventory (capsule inventory)
CREATE INDEX IF NOT EXISTS idx_testoup_inventory_email
ON testoup_inventory(email);

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
