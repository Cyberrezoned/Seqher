import { notFound } from 'next/navigation';
import NewsForm from "../../NewsForm";
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { NewsArticle } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getNewsArticle(id: string): Promise<NewsArticle | null> {
    const docRef = doc(db, 'news', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            publishedDate: data.publishedDate.toDate().toISOString(),
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
