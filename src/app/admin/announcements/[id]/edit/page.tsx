import { notFound } from 'next/navigation';
import AnnouncementForm from "../../AnnouncementForm";
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Announcement } from '@/lib/types';


type Props = {
    params: Promise<{ id: string }>
}

async function getAnnouncement(id: string): Promise<Announcement | null> {
    const { data, error } = await supabaseAdmin
        .from('announcements')
        .select('id,title,content,locale,created_at')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Failed to load announcement from Supabase:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        content: data.content,
        locale: (data.locale as Announcement['locale']) || 'ng',
        createdAt: data.created_at || new Date().toISOString(),
    };
}

export default async function EditAnnouncementPage({ params }: Props) {
    const { id } = await params;
    const announcement = await getAnnouncement(id);
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
