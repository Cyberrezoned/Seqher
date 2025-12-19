import { notFound } from 'next/navigation';
import NewsForm from "../../NewsForm";
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { AdminNewsPost } from '../../types';


type Props = {
    params: Promise<{ id: string }>
}

async function getNewsPost(id: string): Promise<AdminNewsPost | null> {
    const primary = await supabaseAdmin
        .from('news')
        .select('id,title,summary,source,link,image_id,published_date,category,locale,created_at,updated_at')
        .eq('id', id)
        .single();

    const fallback = primary.error
        ? await supabaseAdmin
              .from('news')
              .select('id,title,summary,content,slug,imageid,locale,created_at,updated_at')
              .eq('id', id)
              .single()
        : null;

    const data = ((fallback ? fallback.data : primary.data) as any);
    const error = fallback ? fallback.error : primary.error;

    if (error || !data) {
        console.error('Failed to load news article from Supabase:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title ?? '',
        slug:
            data.slug ??
            (typeof data.link === 'string' ? data.link.split('/').filter(Boolean).pop() : '') ??
            '',
        summary: data.summary ?? '',
        content: data.content ?? '',
        imageId: data.image_id ?? data.imageid ?? null,
        locale: (data.locale as AdminNewsPost['locale']) || 'ng',
        createdAt: data.created_at ?? new Date().toISOString(),
        updatedAt: data.updated_at ?? null,
    };
}

export default async function EditNewsArticlePage({ params }: Props) {
    const { id } = await params;
    const post = await getNewsPost(id);
    if (!post) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit News Article</h1>
                <p className="text-muted-foreground">Make changes to the news article below.</p>
            </div>
            <NewsForm post={post} />
        </div>
    )
}
