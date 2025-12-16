import { notFound } from 'next/navigation';
import NewsForm from "../../NewsForm";
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { NewsArticle } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getNewsArticle(id: string): Promise<NewsArticle | null> {
    const { data, error } = await supabaseAdmin
        .from('news')
        .select('id,title,summary,source,link,image_id,published_date,category,locale')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Failed to load news article from Supabase:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        summary: data.summary,
        source: data.source,
        link: data.link,
        imageId: data.image_id,
        publishedDate: data.published_date,
        category: data.category as NewsArticle['category'],
        locale: (data.locale as NewsArticle['locale']) || 'ng',
    };
}

export default async function EditNewsArticlePage({ params }: Props) {
    const article = await getNewsArticle(params.id);
    if (!article) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit News Article</h1>
                <p className="text-muted-foreground">Make changes to the news article below.</p>
            </div>
            <NewsForm article={article} />
        </div>
    )
}
