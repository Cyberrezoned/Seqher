'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { assertAdmin } from '@/lib/auth/require-admin';

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  locale: z.enum(['ng','ca','global']).default('ng'),
});


export async function createOrUpdateAnnouncement(
  data: z.infer<typeof announcementSchema>
) {
    await assertAdmin();

    const validation = announcementSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: `Invalid data: ${validation.error.flatten().fieldErrors}` };
    }
    
    const { id, title, content, locale } = validation.data;
    
    try {
        if (id) {
            // Update existing announcement
            const { error } = await supabaseAdmin
                .from('announcements')
                .update({
                    title,
                    content,
                    locale,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;
        } else {
            // Create new announcement
            const { error } = await supabaseAdmin
                .from('announcements')
                .insert({
                    title,
                    content,
                    locale,
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;
        }
        
        revalidatePath('/'); // For the homepage announcements
        revalidatePath('/admin/announcements');
        
        return { success: true, message: 'Announcement saved successfully' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to save announcement.' };
    }
}


export async function deleteAnnouncement(id: string) {
    await assertAdmin();

    if (!id) {
        return { success: false, message: 'Invalid ID.' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('announcements')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/');
        revalidatePath('/admin/announcements');
        
        return { success: true, message: 'Announcement deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete announcement.' };
    }
}
