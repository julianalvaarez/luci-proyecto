import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onaddiiomxhvxygkkpfk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uYWRkaWlvbXhodnh5Z2trcGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjk0NzYsImV4cCI6MjA4ODg0NTQ3Nn0.QPy1zDiLMW6A8Oub06jn-TsQgZ0VhGpNCjNaN37C6Xk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: aps } = await supabase.from('appointments').select('*').limit(1);
    if(aps && aps.length > 0) {
      const { error, data } = await supabase.from('intake_forms').insert({
          appointment_id: aps[0].id,
          weight: "70.5", // string instead of number
          height: "180",  // string instead of number
          objective: 'Test 2',
          physical_activity: 'None'
      }).select();
      console.log('insert error:', error);
      console.log('inserted data:', data);
    }
}

main();
