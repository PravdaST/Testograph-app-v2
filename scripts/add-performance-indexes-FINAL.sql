-- Performance Indexes Migration - FINAL CORRECT VERSION
-- Add indexes to REAL tables that exist in database
-- Verified via database query - 100% correct table names

-- 1. meal_completions table
-- Used by: /api/user/daily-completion (meals checking)
-- Used by: /api/meals/complete
CREATE INDEX IF NOT EXISTS idx_meal_completions_email_date
ON meal_completions(email, date DESC);

-- 2. workout_sessions table
-- Used by: /api/user/daily-completion (workout checking)
-- Used by: /api/workout/check, /api/workout/complete
CREATE INDEX IF NOT EXISTS idx_workout_sessions_email_date
ON workout_sessions(email, date DESC);

-- 3. sleep_tracking table
-- Used by: /api/user/daily-completion (sleep checking)
-- Used by: /api/sleep/track
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_email_date
ON sleep_tracking(email, date DESC);

-- 4. testoup_tracking table
-- Used by: /api/user/daily-completion (testoup checking)
-- Used by: /api/testoup/track
CREATE INDEX IF NOT EXISTS idx_testoup_tracking_email_date
ON testoup_tracking(email, date DESC);

-- 5. daily_progress_scores table
-- Used by: /api/user/progressive-score (progressive scoring system)
CREATE INDEX IF NOT EXISTS idx_daily_progress_scores_email_date
ON daily_progress_scores(email, date DESC);

-- 6. quiz_results_v2 table
-- Used by: /api/user/program (user program data)
CREATE INDEX IF NOT EXISTS idx_quiz_results_v2_email
ON quiz_results_v2(email);

-- 7. workout_exercise_sets table
-- Used by: /api/workout/sets (exercise tracking)
CREATE INDEX IF NOT EXISTS idx_workout_exercise_sets_email_date
ON workout_exercise_sets(email, date DESC);

-- 8. testoup_inventory table
-- Used by: /api/testoup/inventory (capsule inventory)
CREATE INDEX IF NOT EXISTS idx_testoup_inventory_email
ON testoup_inventory(email);

-- 9. users table
-- Used by: various authentication and profile endpoints
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- Verify all indexes were created successfully
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
