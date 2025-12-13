'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { dbAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const programSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters.').max(200, 'Summary must be less than 200 characters.'),
  description: z.string().min(50, 'Description must be at least 50 characters.'),
  imageId: z.string().min(1, 'Please select an image.'),
  sdgGoals: z.array(z.number()).min(1, 'Please select at least one SDG goal.'),
});

async function getAdminUid(): Promise<string | null> {
    // In a real app, you'd get this from the session.
    // For now, we can't securely verify the user, so we'll have to allow it
    // for the sake of functionality, but this is NOT secure.
    return 'admin-placeholder-uid';
}

export async function createOrUpdateProgram(
  data: z.infer<typeof programSchema>
) {
    const adminUid = await getAdminUid();
    if (!adminUid) { 
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' }; 
    }

    const validation = programSchema.safeParse(data);
    if (!validation.success) {
        const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat().join(' ');
        return { success: false, message: `Invalid data: ${errorMessages}` };
    }
    
    const { id, ...programData } = validation.data;
    
    try {
        if (id) {
            const ref = dbAdmin.collection('programs').doc(id);
            await ref.update(programData);
        } else {
            const newRef = dbAdmin.collection('programs').doc();
            await newRef.set({
                ...programData,
                id: newRef.id,
                createdAt: FieldValue.serverTimestamp(),
            });
        }
        
        revalidatePath('/ng'); // Homepage featured programs
        revalidatePath('/ng/programs'); // All programs page
        revalidatePath('/admin/programs'); // Admin programs list
        if (id) {
            revalidatePath(`/ng/programs/${id}`); // Program detail page
        }

        return { success: true, message: 'Program saved successfully' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to save program.' };
    }
}


export async function deleteProgram(id: string) {
    const adminUid = await getAdminUid();
    if (!adminUid) {
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
    }

    if (!id) {
        return { success: false, message: 'Invalid ID.' };
    }

    try {
        const ref = dbAdmin.collection('programs').doc(id);
        await ref.delete();

        revalidatePath('/ng');
        revalidatePath('/ng/programs');
        revalidatePath('/admin/programs');
        revalidatePath(`/ng/programs/${id}`);
        
        return { success: true, message: 'Program deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete program.' };
    }
}
