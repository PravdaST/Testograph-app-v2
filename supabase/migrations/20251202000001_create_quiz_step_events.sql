-- Quiz Step Events - Tracking user behavior through quiz steps
-- Created: 2024-12-02

-- Create quiz_step_events table
CREATE TABLE IF NOT EXISTS quiz_step_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('libido', 'energy', 'muscle')),
  step_number INTEGER NOT NULL,
  question_id TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('step_entered', 'step_exited', 'answer_selected', 'back_clicked')),
  time_spent_seconds INTEGER,
  answer_value TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast querying
CREATE INDEX idx_quiz_step_events_session ON quiz_step_events(session_id);
CREATE INDEX idx_quiz_step_events_category ON quiz_step_events(category);
CREATE INDEX idx_quiz_step_events_step ON quiz_step_events(step_number);
CREATE INDEX idx_quiz_step_events_event_type ON quiz_step_events(event_type);
CREATE INDEX idx_quiz_step_events_created ON quiz_step_events(created_at DESC);

-- Add composite index for funnel analysis
CREATE INDEX idx_quiz_step_funnel ON quiz_step_events(category, step_number, event_type);

-- Enable RLS
ALTER TABLE quiz_step_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (quiz tracking)
CREATE POLICY "Allow anonymous inserts" ON quiz_step_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON quiz_step_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE quiz_step_events IS 'Tracks user behavior through quiz steps for funnel analysis';
