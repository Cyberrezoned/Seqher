'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

// We need a way to get the admin user's UID on the server.
// The most reliable way is to use a library that manages server-side sessions.
// For now, we will assume we get it from a session, but this part is not fully implemented.
// This placeholder function needs to be replaced with a real auth check.
async function getAdminUid(): Promise<string | null> {
    // In a real app, you'd get this from the session.
    // For now, we can't securely verify the user, so we'll have to allow it
    // for the sake of functionality, but this is NOT secure.
    return 'admin-placeholder-uid'; 
}


const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  locale: z.enum(['ng','ca','global']).default('ng'),
});


export async function createOrUpdateAnnouncement(
  data: z.infer<typeof announcementSchema>
) {
    const adminUid = await getAdminUid();
    if (!adminUid) { 
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' }; 
    }

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
    const adminUid = await getAdminUid();
    if (!adminUid) {
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
    }

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
