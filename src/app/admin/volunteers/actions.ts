'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { assertAdmin } from '@/lib/auth/require-admin';

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['new', 'contacted', 'accepted', 'rejected']).optional(),
  adminNotes: z.string().max(2000).optional(),
});

export async function updateVolunteerApplication(input: z.infer<typeof updateSchema>) {
  await assertAdmin();
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: 'Invalid update payload.' };

  const { id, status, adminNotes } = parsed.data;

  const updatePayload: Record<string, unknown> = {};
  if (typeof status !== 'undefined') updatePayload.status = status;
  if (typeof adminNotes !== 'undefined') updatePayload.admin_notes = adminNotes;
  if (Object.keys(updatePayload).length === 0) {
    return { success: true, message: 'No changes.' };
  }

  const { error } = await supabaseAdmin.from('volunteer_applications').update(updatePayload).eq('id', id);
  if (error) {
    return {
      success: false,
      message:
        error.message ||
        'Failed to update volunteer application. If this is a new deployment, ensure `volunteer_applications.status` and `volunteer_applications.admin_notes` exist.',
    };
  }

  revalidatePath('/admin/volunteers');
  return { success: true, message: 'Volunteer application updated.' };
}

export async function deleteVolunteerApplication(id: string) {
  await assertAdmin();
  if (!id) return { success: false, message: 'Missing id.' };

  const { error } = await supabaseAdmin.from('volunteer_applications').delete().eq('id', id);
  if (error) return { success: false, message: error.message || 'Failed to delete.' };

  revalidatePath('/admin/volunteers');
  return { success: true, message: 'Volunteer application deleted.' };
}

