-- Migration: Add results_viewed and offer_clicked event types to quiz_step_events
-- Date: 2025-12-02
-- Purpose: Allow tracking of results page views and offer clicks

-- Drop the existing check constraint
ALTER TABLE quiz_step_events DROP CONSTRAINT IF EXISTS quiz_step_events_event_type_check;

-- Add updated check constraint with all event types including results_viewed and offer_clicked
ALTER TABLE quiz_step_events ADD CONSTRAINT quiz_step_events_event_type_check
CHECK (event_type IN (
  'step_entered',
  'step_exited',
  'answer_selected',
  'back_clicked',
  'quiz_abandoned',
  'page_hidden',
  'page_visible',
  'quiz_completed',
  'results_viewed',
  'offer_clicked'
));
