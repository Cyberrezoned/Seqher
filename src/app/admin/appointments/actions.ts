'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { assertAdmin } from '@/lib/auth/require-admin';

const statusSchema = z.enum(['pending', 'confirmed', 'cancelled']);

export async function updateAppointmentStatus(input: { id: string; status: z.infer<typeof statusSchema> }) {
  await assertAdmin();
  if (!input?.id) return { success: false, message: 'Missing id.' };

  const parsedStatus = statusSchema.safeParse(input.status);
  if (!parsedStatus.success) return { success: false, message: 'Invalid status.' };

  const { error } = await supabaseAdmin
    .from('appointments')
    .update({ status: parsedStatus.data })
    .eq('id', input.id);

  if (error) return { success: false, message: error.message || 'Failed to update appointment.' };

  revalidatePath('/admin/appointments');
  return { success: true, message: 'Appointment updated.' };
}

export async function deleteAppointment(id: string) {
  await assertAdmin();
  if (!id) return { success: false, message: 'Missing id.' };

  const { error } = await supabaseAdmin.from('appointments').delete().eq('id', id);
  if (error) return { success: false, message: error.message || 'Failed to delete appointment.' };

  revalidatePath('/admin/appointments');
  return { success: true, message: 'Appointment deleted.' };
}

