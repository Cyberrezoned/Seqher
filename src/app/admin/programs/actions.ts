'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, collection, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';


const programSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters.').max(200, 'Summary must be less than 200 characters.'),
  description: z.string().min(50, 'Description must be at least 50 characters.'),
  imageId: z.string().min(1, 'Please select an image.'),
  sdgGoals: z.array(z.number()).min(1, 'Please select at least one SDG goal.'),
});

async function getAdminUser(): Promise<AppUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
        return { ...user, ...userDoc.data() } as AppUser;
    }
    return null;
}

export async function createOrUpdateProgram(
  data: z.infer<typeof programSchema>
) {
    const user = await getAdminUser();

    if (!user) { 
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
            const ref = doc(db, 'programs', id);
            await updateDoc(ref, programData);
        } else {
            const newRef = doc(collection(db, 'programs'));
            await setDoc(newRef, {
                ...programData,
                id: newRef.id,
                createdAt: serverTimestamp(),
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
        console.error("Error saving program:", error);
        return { success: false, message: error.message || 'Failed to save program.' };
    }
}


export async function deleteProgram(id: string) {
    const user = await getAdminUser();
    if (!user) {
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
    }

    if (!id) {
        return { success: false, message: 'Invalid ID.' };
    }

    try {
        const ref = doc(db, 'programs', id);
        await deleteDoc(ref);

        revalidatePath('/ng');
        revalidatePath('/ng/programs');
        revalidatePath('/admin/programs');
        revalidatePath(`/ng/programs/${id}`);
        
        return { success: true, message: 'Program deleted successfully.' };
    } catch (error: any) {
        console.error("Error deleting program:", error);
        return { success: false, message: 'Failed to delete program.' };
    }
}
