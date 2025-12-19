'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { AppUser } from '@/lib/types';


const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  content: z.string().min(50),
  slug: z.string().min(5).regex(/^[a-z0-9-]+$/),
  imageId: z.string().optional(),
  locale: z.enum(['ng','ca','global']).default('ng'),
});

// This placeholder function needs to be replaced with a real auth check.
async function getAdminUser(): Promise<AppUser | null> {
    // In a real app, you'd verify a session token and get user data.
    // For now, we'll return a placeholder user. This is NOT secure.
    return { 
        id: 'admin-placeholder-uid',
        email: null,
        displayName: 'Admin User',
        role: 'admin',
        locale: 'ng',
        metadata: {},
    };
}


export async function createOrUpdatePost(
  data: z.infer<typeof blogPostSchema>
) {
    const user = await getAdminUser();

    if (!user || user.role !== 'admin') { 
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' }; 
    }

    const validation = blogPostSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: `Invalid data: ${validation.error.flatten().fieldErrors}` };
    }
    
    const { id, title, content, slug, imageId, locale } = validation.data;
    
    try {
        if (id) {
            // Update existing post in Supabase (snake_case columns)
            const updatePayload = {
                title,
                content,
                slug,
                image_id: imageId || 'blog-community-gardens',
                locale,
                updated_at: new Date().toISOString(),
            };
            let { error } = await supabaseAdmin.from('blog_posts').update(updatePayload).eq('id', id);
            if (error) {
                // Support legacy `blogposts` table.
                ({ error } = await supabaseAdmin.from('blogposts').update(updatePayload).eq('id', id));
            }
            
            if (error) throw error;
        } else {
            // Create new post in Supabase
            const insertPayload = {
                title,
                content,
                slug,
                image_id: imageId || 'blog-community-gardens',
                author: user.displayName || "Admin User",
                author_id: user.id,
                locale,
                created_at: new Date().toISOString(),
            };
            let { error } = await supabaseAdmin.from('blog_posts').insert(insertPayload);
            if (error) {
                ({ error } = await supabaseAdmin.from('blogposts').insert(insertPayload));
            }
            
            if (error) throw error;
        }
        
        // Revalidate paths to show updated content
        revalidatePath('/ng/blog');
        revalidatePath(`/ng/blog/${slug}`);
        revalidatePath('/admin/blog');
        
        return { success: true, message: 'Post saved successfully' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to save post.' };
    }
}


export async function deletePost(postId: string) {
    const user = await getAdminUser();
    if (!user || user.role !== 'admin') {
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
    }

    if (!postId) {
        return { success: false, message: 'Invalid post ID.' };
    }

    try {
        // Get the post to retrieve the slug for revalidation
        const fetchSlugFrom = async (table: string) =>
            supabaseAdmin.from(table).select('slug').eq('id', postId).single();
        let { data: post, error: slugError } = await fetchSlugFrom('blog_posts');
        if (slugError) {
            const fallback = await fetchSlugFrom('blogposts');
            post = fallback.data;
        }

        // Delete the post from Supabase
        let { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', postId);
        if (error) {
            ({ error } = await supabaseAdmin.from('blogposts').delete().eq('id', postId));
        }

        if (error) throw error;

        revalidatePath('/ng/blog');
        if (post?.slug) {
            revalidatePath(`/ng/blog/${post.slug}`);
        }
        revalidatePath('/admin/blog');
        
        return { success: true, message: 'Post deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete post.' };
    }
}
