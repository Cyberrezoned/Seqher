'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { assertAdmin } from '@/lib/auth/require-admin';

export async function deleteGrantSubscription(id: string) {
  await assertAdmin();
  if (!id) return { success: false, message: 'Missing id.' };

  const { error } = await supabaseAdmin.from('grant_subscriptions').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete grant subscription:', error);
    return { success: false, message: 'Failed to delete grant request.' };
  }

  revalidatePath('/admin/grants');
  return { success: true, message: 'Grant request deleted.' };
}
