import { notFound } from 'next/navigation';
import AnnouncementForm from "../../AnnouncementForm";
import { dbAdmin } from '@/lib/firebase-admin';
import type { Announcement } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getAnnouncement(id: string): Promise<Announcement | null> {
    const docRef = dbAdmin.collection('announcements').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        const data = docSnap.data();
        if (!data) return null;
        return {
            id: docSnap.id,
            ...data,
            createdAt: (data.createdAt.toDate() as Date).toISOString(),
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
