-- Create workout_sessions table for tracking workout timer data
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL, -- 1-7 (Monday-Sunday)
  workout_name TEXT NOT NULL,
  target_duration_minutes INTEGER NOT NULL,
  actual_duration_minutes INTEGER, -- Calculated when finished
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  paused_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  total_pause_duration_seconds INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'paused', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries by email and date
CREATE INDEX IF NOT EXISTS idx_workout_sessions_email_date
ON workout_sessions(email, date);

-- Index for faster queries by status (to find active sessions)
CREATE INDEX IF NOT EXISTS idx_workout_sessions_status
ON workout_sessions(email, status);

-- Comments for documentation
COMMENT ON TABLE workout_sessions IS 'Tracks workout timer sessions with start/pause/finish times';
COMMENT ON COLUMN workout_sessions.total_pause_duration_seconds IS 'Total time spent paused in seconds';
COMMENT ON COLUMN workout_sessions.actual_duration_minutes IS 'Calculated duration excluding pause time when workout is finished';
