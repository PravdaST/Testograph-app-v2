const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mrpsaqtmucxpawajfxfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycHNhcXRtdWN4cGF3YWpmeGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA5MTM3OCwiZXhwIjoyMDc0NjY3Mzc4fQ.8wvWlc4rVRyHemfg5_MzogiIVhwKO1g7ui8xAwjW2gQ'
);

async function fixAllPaidUsers() {
  console.log('=== FIXING ALL PAID USERS WITHOUT INVENTORY ===\n');

  // Get all paid orders with valid email
  const { data: orders, error: ordersErr } = await supabase
    .from('pending_orders')
    .select('*')
    .eq('status', 'paid')
    .neq('email', '')
    .not('email', 'is', null)
    .order('paid_at', { ascending: false });

  if (ordersErr) {
    console.error('Error fetching orders:', ordersErr);
    return;
  }

  console.log('Found', orders.length, 'paid orders with valid email\n');

  let fixed = 0;
  let alreadyOk = 0;
  let errors = 0;

  for (const order of orders) {
    if (!order.email || order.email.trim() === '') continue;

    // Check if user already has inventory
    const { data: inv } = await supabase
      .from('testoup_inventory')
      .select('capsules_remaining')
      .eq('email', order.email)
      .single();

    if (inv && inv.capsules_remaining > 0) {
      alreadyOk++;
      continue;
    }

    // Calculate capsules from order
    const productInfo = order.products?.[0] || {};
    const capsules = productInfo.totalCapsules || (productInfo.quantity * 60) || 60;
    const bottles = productInfo.quantity || 1;

    console.log('Adding capsules for:', order.email);
    console.log('  Order #:', order.order_number);
    console.log('  Capsules:', capsules);

    // Upsert inventory
    const { error: upsertErr } = await supabase
      .from('testoup_inventory')
      .upsert({
        email: order.email,
        total_capsules: capsules,
        capsules_remaining: capsules,
        bottles_purchased: bottles,
        last_refill_date: new Date().toISOString(),
        order_id: order.order_id
      }, { onConflict: 'email' });

    if (upsertErr) {
      console.error('  ERROR:', upsertErr.message);
      errors++;
    } else {
      console.log('  SUCCESS!\n');
      fixed++;
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log('Already OK:', alreadyOk);
  console.log('Fixed:', fixed);
  console.log('Errors:', errors);
  console.log('Total processed:', orders.length);
}

fixAllPaidUsers();
