'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

const newsArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  source: z.string().min(2, "Source must be at least 2 characters"),
  link: z.string().url("Please enter a valid URL"),
  imageId: z.string().min(1, "Please select an image"),
  publishedDate: z.date(),
  category: z.enum(['Climate Action', 'Global Health', 'Education', 'Economic Growth', 'Peace and Justice', 'Sustainability']),
});

async function getAdminUid(): Promise<string | null> {
    // In a real app, you'd get this from the session.
    // For now, we can't securely verify the user, so we'll have to allow it
    // for the sake of functionality, but this is NOT secure.
    return 'admin-placeholder-uid'; 
}

export async function createOrUpdateNewsArticle(
  data: z.infer<typeof newsArticleSchema>
) {
    const adminUid = await getAdminUid();
    if (!adminUid) { 
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' }; 
    }

    const validation = newsArticleSchema.safeParse(data);
    if (!validation.success) {
        const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat().join(' ');
        return { success: false, message: `Invalid data: ${errorMessages}` };
    }
    
    const { id, ...articleData } = validation.data;
    
    try {
        if (id) {
            const { error } = await supabaseAdmin
                .from('news')
                .update({
                    title: articleData.title,
                    summary: articleData.summary,
                    source: articleData.source,
                    link: articleData.link,
                    image_id: articleData.imageId,
                    published_date: articleData.publishedDate,
                    category: articleData.category,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;
        } else {
            const { error } = await supabaseAdmin
                .from('news')
                .insert({
                    title: articleData.title,
                    summary: articleData.summary,
                    source: articleData.source,
                    link: articleData.link,
                    image_id: articleData.imageId,
                    published_date: articleData.publishedDate,
                    category: articleData.category,
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;
        }
        
        revalidatePath('/ng/news');
        revalidatePath('/admin/news');

        return { success: true, message: 'News article saved successfully' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to save news article.' };
    }
}


export async function deleteNewsArticle(id: string) {
    const adminUid = await getAdminUid();
    if (!adminUid) {
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
    }

    if (!id) {
        return { success: false, message: 'Invalid ID.' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('news')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/ng/news');
        revalidatePath('/admin/news');
        
        return { success: true, message: 'News article deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete news article.' };
    }
}
