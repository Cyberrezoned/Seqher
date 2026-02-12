import { NextResponse } from 'next/server';

import { assertAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await assertAdmin();

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [
      pendingAppointments,
      recentAppointments,
      recentGrantRequests,
      recentVolunteerApplications,
    ] = await Promise.all([
      supabaseAdmin.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('appointments').select('id', { count: 'exact', head: true }).gte('created_at', since),
      supabaseAdmin.from('grant_subscriptions').select('id', { count: 'exact', head: true }).gte('created_at', since),
      supabaseAdmin.from('volunteer_applications').select('id', { count: 'exact', head: true }).gte('created_at', since),
    ]);

    return NextResponse.json({
      since,
      appointments: {
        pending: pendingAppointments.count ?? 0,
        recent: recentAppointments.count ?? 0,
      },
      grants: {
        recent: recentGrantRequests.count ?? 0,
      },
      volunteers: {
        recent: recentVolunteerApplications.count ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
