'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { assertAdmin } from '@/lib/auth/require-admin';

const programSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters.').max(200, 'Summary must be less than 200 characters.'),
  description: z.string().min(50, 'Description must be at least 50 characters.'),
  imageId: z.string().min(1, 'Please select an image.'),
  sdgGoals: z.array(z.number()).min(1, 'Please select at least one SDG goal.'),
  locale: z.enum(['ng','ca','global']).default('ng'),
});

export async function createOrUpdateProgram(
  data: z.infer<typeof programSchema>
) {
    await assertAdmin();

    const validation = programSchema.safeParse(data);
    if (!validation.success) {
        const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat().join(' ');
        return { success: false, message: `Invalid data: ${errorMessages}` };
    }
    
    const { id, ...programData } = validation.data;
    
    try {
        if (id) {
            const primaryUpdate = {
                title: programData.title,
                summary: programData.summary,
                description: programData.description,
                image_id: programData.imageId,
                sdg_goals: programData.sdgGoals,
                locale: programData.locale,
                updated_at: new Date().toISOString(),
            };
            const fallbackUpdate = {
                title: programData.title,
                summary: programData.summary,
                description: programData.description,
                imageid: programData.imageId,
                sdggoals: programData.sdgGoals,
                updated_at: new Date().toISOString(),
            };

            let { error } = await supabaseAdmin.from('programs').update(primaryUpdate).eq('id', id);
            if (error) {
                ({ error } = await supabaseAdmin.from('programs').update(fallbackUpdate).eq('id', id));
            }

            if (error) throw error;
        } else {
            const primaryInsert = {
                title: programData.title,
                summary: programData.summary,
                description: programData.description,
                image_id: programData.imageId,
                sdg_goals: programData.sdgGoals,
                locale: programData.locale,
                created_at: new Date().toISOString(),
            };
            const fallbackInsert = {
                title: programData.title,
                summary: programData.summary,
                description: programData.description,
                imageid: programData.imageId,
                sdggoals: programData.sdgGoals,
                created_at: new Date().toISOString(),
            };

            let { error } = await supabaseAdmin.from('programs').insert(primaryInsert);
            if (error) {
                ({ error } = await supabaseAdmin.from('programs').insert(fallbackInsert));
            }

            if (error) throw error;
        }
        
        revalidatePath('/ng'); // Homepage featured programs
        revalidatePath('/ng/programs'); // All programs page
        revalidatePath('/admin/programs'); // Admin programs list
        if (id) {
            revalidatePath(`/ng/programs/${id}`); // Program detail page
        }

        return { success: true, message: 'Program saved successfully' };

    } catch (error: any) {
        console.error('Failed to save program:', error);
        return { success: false, message: 'Failed to save program.' };
    }
}


export async function deleteProgram(id: string) {
    await assertAdmin();

    if (!id) {
        return { success: false, message: 'Invalid ID.' };
    }

    try {
        const { error } = await supabaseAdmin
            .from('programs')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/ng');
        revalidatePath('/ng/programs');
        revalidatePath('/admin/programs');
        revalidatePath(`/ng/programs/${id}`);
        
        return { success: true, message: 'Program deleted successfully.' };
    } catch (error: any) {
        console.error('Failed to delete program:', error);
        return { success: false, message: 'Failed to delete program.' };
    }
}
