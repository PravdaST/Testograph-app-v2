const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mrpsaqtmucxpawajfxfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'
);

async function verify() {
  console.log('=== VERIFICATION: ALL PAID USERS WITH VALID EMAIL ===\n');

  const { data: orders } = await supabase
    .from('pending_orders')
    .select('email, order_number, products, paid_at')
    .eq('status', 'paid')
    .neq('email', '')
    .not('email', 'is', null)
    .order('paid_at', { ascending: false });

  let allOk = true;
  let okCount = 0;
  let missingCount = 0;

  for (const order of orders) {
    const { data: inv } = await supabase
      .from('testoup_inventory')
      .select('capsules_remaining, total_capsules')
      .eq('email', order.email)
      .single();

    const productInfo = order.products?.[0] || {};
    const orderedCapsules = productInfo.totalCapsules || 60;
    const hasCapsules = inv && inv.capsules_remaining > 0;
    const status = hasCapsules ? '✅ OK' : '❌ MISSING';

    if (hasCapsules) {
      okCount++;
    } else {
      allOk = false;
      missingCount++;
    }

    console.log(status + ' | ' + order.email);
    console.log('     Order #' + order.order_number + ' | Ordered: ' + orderedCapsules + ' | Has: ' + (inv?.capsules_remaining || 0));
    console.log('');
  }

  console.log('===================');
  console.log('OK:', okCount);
  console.log('Missing:', missingCount);
  console.log(allOk ? '🎉 ALL USERS HAVE CAPSULES!' : '⚠️ SOME USERS STILL MISSING CAPSULES');
}

verify();
