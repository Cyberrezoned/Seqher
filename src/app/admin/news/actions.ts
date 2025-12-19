'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

const newsPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  summary: z.string().min(20, 'Summary must be at least 20 characters'),
  content: z.string().optional(),
  imageId: z.string().optional(),
  locale: z.enum(['ng', 'ca', 'global']).default('ng'),
});

async function getAdminUid(): Promise<string | null> {
  // In a real app, you'd get this from the session.
  return 'admin-placeholder-uid';
}

export async function createOrUpdateNewsArticle(data: z.infer<typeof newsPostSchema>) {
  const adminUid = await getAdminUid();
  if (!adminUid) {
    return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
  }

  const validation = newsPostSchema.safeParse(data);
  if (!validation.success) {
    const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat().join(' ');
    return { success: false, message: `Invalid data: ${errorMessages}` };
  }

  const { id, title, slug, summary, content, imageId, locale } = validation.data;
  const now = new Date().toISOString();

  try {
    if (id) {
      // Prefer legacy/WP-style `news` schema: title, summary, content, slug, imageid, locale
      const wpUpdate = {
        title,
        summary,
        content: content ?? '',
        slug,
        imageid: imageId ?? null,
        locale,
        updated_at: now,
      };

      let { error } = await supabaseAdmin.from('news').update(wpUpdate).eq('id', id);
      if (error) {
        // Fallback to newer schema: summary/source/link/image_id/published_date/category/locale
        const modernUpdate = {
          title,
          summary,
          source: 'SEQHER',
          link: `/ng/news/${slug}`,
          image_id: imageId ?? null,
          published_date: now,
          category: 'Sustainability',
          locale,
          updated_at: now,
        };
        ({ error } = await supabaseAdmin.from('news').update(modernUpdate).eq('id', id));
      }
      if (error) throw error;
    } else {
      const wpInsert = {
        title,
        summary,
        content: content ?? '',
        slug,
        imageid: imageId ?? null,
        locale,
        created_at: now,
        updated_at: now,
      };

      let { error } = await supabaseAdmin.from('news').insert(wpInsert);
      if (error) {
        const modernInsert = {
          title,
          summary,
          source: 'SEQHER',
          link: `/ng/news/${slug}`,
          image_id: imageId ?? null,
          published_date: now,
          category: 'Sustainability',
          locale,
          created_at: now,
          updated_at: now,
        };
        ({ error } = await supabaseAdmin.from('news').insert(modernInsert));
      }
      if (error) throw error;
    }

    revalidatePath('/ng/news');
    revalidatePath('/admin/news');

    return { success: true, message: 'News post saved successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to save news post.' };
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
    const { error } = await supabaseAdmin.from('news').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/ng/news');
    revalidatePath('/admin/news');

    return { success: true, message: 'News post deleted successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete news post.' };
  }
}

