'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, collection, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';


const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
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


export async function createOrUpdateAnnouncement(
  data: z.infer<typeof announcementSchema>
) {
    const user = await getAdminUser();

    if (!user) { 
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' }; 
    }

    const validation = announcementSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: `Invalid data: ${validation.error.flatten().fieldErrors}` };
    }
    
    const { id, title, content } = validation.data;
    
    try {
        if (id) {
            // Update existing announcement
            const ref = doc(db, 'announcements', id);
            await updateDoc(ref, {
                title,
                content,
            });
        } else {
            // Create new announcement
            const newRef = doc(collection(db, 'announcements'));
            await setDoc(newRef, {
                id: newRef.id,
                title,
                content,
                createdAt: serverTimestamp(),
            });
        }
        
        revalidatePath('/'); // For the homepage announcements
        revalidatePath('/admin/announcements');
        
        return { success: true, message: 'Announcement saved successfully' };

    } catch (error: any) {
        console.error("Error saving announcement:", error);
        return { success: false, message: error.message || 'Failed to save announcement.' };
    }
}


export async function deleteAnnouncement(id: string) {
    const user = await getAdminUser();
    if (!user) {
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
    }

    if (!id) {
        return { success: false, message: 'Invalid ID.' };
    }

    try {
        const ref = doc(db, 'announcements', id);
        await deleteDoc(ref);

        revalidatePath('/');
        revalidatePath('/admin/announcements');
        
        return { success: true, message: 'Announcement deleted successfully.' };
    } catch (error: any) {
        console.error("Error deleting announcement:", error);
        return { success: false, message: 'Failed to delete announcement.' };
    }
}
