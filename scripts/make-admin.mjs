import 'dotenv/config';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run make-admin -- you@example.com');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Search by listing users (sufficient for small projects).
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000, page: 1 });
  if (error) throw error;

  const user = data.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error(`No Supabase auth user found for email: ${email}`);
    process.exit(1);
  }

  const currentRole = user.app_metadata?.role;
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...(user.app_metadata || {}), role: 'admin' },
  });
  if (updateError) throw updateError;

  console.log(`Updated ${email}: app_metadata.role ${currentRole ?? '(none)'} -> admin`);
}

main().catch((err) => {
  console.error('Failed to update role:', err);
  process.exit(1);
});

