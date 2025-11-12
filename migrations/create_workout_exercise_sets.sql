-- Create workout_exercise_sets table for per-set workout logging
-- This allows users to track weight, reps, and RPE for each set of every exercise

CREATE TABLE IF NOT EXISTS workout_exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  exercise_name TEXT NOT NULL,
  exercise_order INTEGER NOT NULL,
  set_number INTEGER NOT NULL, -- 1, 2, 3, 4, ...
  target_reps TEXT NOT NULL, -- "12", "10-12", "AMRAP", "Max"
  actual_reps INTEGER NOT NULL,
  weight_kg NUMERIC(6,2), -- 0.00 - 9999.99 kg (NULL for bodyweight exercises)
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion (1-10, optional)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries by email and date
CREATE INDEX IF NOT EXISTS idx_workout_exercise_sets_email_date
ON workout_exercise_sets(email, date);

-- Index for faster queries by workout session
CREATE INDEX IF NOT EXISTS idx_workout_exercise_sets_session
ON workout_exercise_sets(workout_session_id);

-- Index for finding previous workout data for specific exercise
CREATE INDEX IF NOT EXISTS idx_workout_exercise_sets_exercise
ON workout_exercise_sets(email, exercise_name, date);

-- Composite index for ordering sets within a workout
CREATE INDEX IF NOT EXISTS idx_workout_exercise_sets_workout_order
ON workout_exercise_sets(workout_session_id, exercise_order, set_number);

-- Comments for documentation
COMMENT ON TABLE workout_exercise_sets IS 'Per-set workout logging with weight, reps, and RPE tracking';
COMMENT ON COLUMN workout_exercise_sets.exercise_order IS 'Order of exercise in the workout (1, 2, 3, ...)';
COMMENT ON COLUMN workout_exercise_sets.set_number IS 'Set number for this exercise (1, 2, 3, ...)';
COMMENT ON COLUMN workout_exercise_sets.target_reps IS 'Target reps from workout plan (e.g., "12", "8-10", "AMRAP")';
COMMENT ON COLUMN workout_exercise_sets.actual_reps IS 'Actual reps performed by user';
COMMENT ON COLUMN workout_exercise_sets.weight_kg IS 'Weight used in kg (NULL for bodyweight exercises)';
COMMENT ON COLUMN workout_exercise_sets.rpe IS 'Rate of Perceived Exertion: 1=Very Easy, 10=Maximum Effort';
