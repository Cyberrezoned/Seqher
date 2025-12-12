import { notFound } from 'next/navigation';
import AnnouncementForm from "../../AnnouncementForm";
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Announcement } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getAnnouncement(id: string): Promise<Announcement | null> {
    const docRef = doc(db, 'announcements', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
        } as Announcement;
    }
    return null;
}

export default async function EditAnnouncementPage({ params }: Props) {
    const announcement = await getAnnouncement(params.id);
    if (!announcement) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit Announcement</h1>
                <p className="text-muted-foreground">Make changes to the announcement below.</p>
            </div>
            <AnnouncementForm announcement={announcement} />
        </div>
    )
}
