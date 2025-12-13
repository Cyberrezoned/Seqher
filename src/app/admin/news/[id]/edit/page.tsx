import { notFound } from 'next/navigation';
import NewsForm from "../../NewsForm";
import { dbAdmin } from '@/lib/firebase-admin';
import type { NewsArticle } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getNewsArticle(id: string): Promise<NewsArticle | null> {
    if (!dbAdmin) {
        console.error("Firebase Admin is not configured. Unable to fetch article.");
        return null;
    }
    const docRef = dbAdmin.collection('news').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        const data = docSnap.data();
        if (!data) return null;
        return {
            id: docSnap.id,
            ...data,
            publishedDate: (data.publishedDate.toDate() as Date).toISOString(),
        } as NewsArticle;
    }
    return null;
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
