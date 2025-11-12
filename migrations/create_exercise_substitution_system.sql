-- Exercise Substitution System
-- Allows users to replace exercises with alternatives due to injury/equipment

-- Table 1: Exercise Alternatives
-- Pre-populated with alternative exercises for common movements
CREATE TABLE IF NOT EXISTS exercise_alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_exercise_name TEXT NOT NULL,
  alternative_exercise_name TEXT NOT NULL,
  alternative_exercise_name_en TEXT NOT NULL,
  alternative_exercisedb_id TEXT,
  muscle_group TEXT NOT NULL, -- chest, back, legs, shoulders, arms, core
  equipment_needed TEXT NOT NULL, -- barbell, dumbbell, bodyweight, machine, resistance_band
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  reason TEXT, -- "No equipment", "Joint-friendly", "Easier variation", etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercise_alternatives_original
ON exercise_alternatives(original_exercise_name);

-- Table 2: User Exercise Substitutions
-- Tracks which exercises users have substituted in their workouts
CREATE TABLE IF NOT EXISTS user_exercise_substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL,
  exercise_order INTEGER NOT NULL,
  original_exercise_name TEXT NOT NULL,
  substituted_exercise JSONB NOT NULL, -- Full exercise object with name, sets, reps, etc.
  reason TEXT, -- User's reason for substitution
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, date, exercise_order)
);

CREATE INDEX IF NOT EXISTS idx_user_exercise_substitutions_email_date
ON user_exercise_substitutions(email, date);

-- Comments
COMMENT ON TABLE exercise_alternatives IS 'Pre-defined alternative exercises for substitution';
COMMENT ON TABLE user_exercise_substitutions IS 'User substitutions - tracks replaced exercises per workout';
COMMENT ON COLUMN exercise_alternatives.reason IS 'Why this is a good alternative (e.g., Joint-friendly, No equipment)';
COMMENT ON COLUMN user_exercise_substitutions.substituted_exercise IS 'Full exercise object in JSONB format';

-- Sample data for common exercises (can be expanded)
-- This is just starter data - more can be added via admin panel or seed script
INSERT INTO exercise_alternatives (original_exercise_name, alternative_exercise_name, alternative_exercise_name_en, muscle_group, equipment_needed, difficulty_level, reason) VALUES
('Bench Press', 'Push-ups', 'Push-ups', 'chest', 'bodyweight', 'beginner', 'No equipment needed'),
('Bench Press', 'Dumbbell Chest Press', 'Dumbbell Chest Press', 'chest', 'dumbbell', 'intermediate', 'Safer for shoulders'),
('Squats', 'Bulgarian Split Squats', 'Bulgarian Split Squats', 'legs', 'bodyweight', 'intermediate', 'Unilateral, joint-friendly'),
('Deadlift', 'Romanian Deadlift', 'Romanian Deadlift', 'back', 'barbell', 'intermediate', 'Less lower back stress'),
('Pull-ups', 'Inverted Rows', 'Inverted Rows', 'back', 'bodyweight', 'beginner', 'Easier pulling variation'),
('Overhead Press', 'Dumbbell Shoulder Press', 'Dumbbell Shoulder Press', 'shoulders', 'dumbbell', 'intermediate', 'Better range of motion')
ON CONFLICT DO NOTHING;
