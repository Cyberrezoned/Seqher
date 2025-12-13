'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, collection, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';

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

async function getAdminUser(): Promise<AppUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
        return { ...user, ...userDoc.data() } as AppUser;
    }
    return null;
}

export async function createOrUpdateNewsArticle(
  data: z.infer<typeof newsArticleSchema>
) {
    const user = await getAdminUser();

    if (!user) { 
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
            const ref = doc(db, 'news', id);
            await updateDoc(ref, {
                ...articleData,
                publishedDate: articleData.publishedDate,
            });
        } else {
            const newRef = doc(collection(db, 'news'));
            await setDoc(newRef, {
                ...articleData,
                id: newRef.id,
            });
        }
        
        revalidatePath('/ng/news');
        revalidatePath('/admin/news');

        return { success: true, message: 'News article saved successfully' };

    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to save news article.' };
    }
}


export async function deleteNewsArticle(id: string) {
    const user = await getAdminUser();
    if (!user) {
        return { success: false, message: 'Unauthorized: You must be an admin to perform this action.' };
    }

    if (!id) {
        return { success: false, message: 'Invalid ID.' };
    }

    try {
        const ref = doc(db, 'news', id);
        await deleteDoc(ref);

        revalidatePath('/ng/news');
        revalidatePath('/admin/news');
        
        return { success: true, message: 'News article deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete news article.' };
    }
}
