import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mrpsaqtmucxpawajfxfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'
);

async function check() {
  // Get recent step events and look for Mihail
  const { data, error } = await supabase
    .from('quiz_step_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('=== Searching for Mihail in answer_value ===\n');

  let foundMihail = false;
  data.forEach(e => {
    if (e.answer_value) {
      const answer = e.answer_value.toLowerCase();
      if (answer.includes('mihail') || answer.includes('михаил') || answer.includes('hristov') || answer.includes('христов')) {
        foundMihail = true;
        console.log('FOUND in session:', e.session_id);
        console.log('  Question:', e.question_id);
        console.log('  Answer:', e.answer_value);
        console.log('  Time:', new Date(e.created_at).toLocaleString());
        console.log('');
      }
    }
  });

  if (!foundMihail) {
    console.log('No answers containing "mihail" or "михаил" found in recent 100 events');
  }

  // Also check quiz_sessions for any sessions that might have failed
  const { data: sessions, error: sessError } = await supabase
    .from('quiz_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  console.log('\n=== Recent quiz_sessions ===');
  if (sessError) {
    console.log('Error fetching sessions:', sessError);
  } else if (sessions) {
    sessions.forEach(s => {
      console.log(`Session ${s.id?.substring(0, 8)}... | Status: ${s.status} | Created: ${new Date(s.created_at).toLocaleString()}`);
    });
  }
}

check();
