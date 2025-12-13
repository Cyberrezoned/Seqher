import { notFound } from 'next/navigation';
import BlogForm from "../../BlogForm";
import { dbAdmin } from '@/lib/firebase-admin';
import type { BlogPost } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getPost(id: string): Promise<BlogPost | null> {
    if (!dbAdmin) {
        return null;
    }
    const docRef = dbAdmin.collection('blogPosts').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        const data = docSnap.data();
        if (!data) return null;
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        } as BlogPost;
    }
    return null;
}

export default async function EditBlogPostPage({ params }: Props) {
    const post = await getPost(params.id);
    if (!post) {
        if (!dbAdmin) {
             return (
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Edit Blog Post</h1>
                        <p className="text-muted-foreground">Make changes to your blog post below.</p>
                    </div>
                    <div className="text-center p-8 text-destructive">
                        Firebase Admin is not configured. Unable to edit post.
                    </div>
                </div>
            )
        }
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit Blog Post</h1>
                <p className="text-muted-foreground">Make changes to your blog post below.</p>
            </div>
            <BlogForm post={post} />
        </div>
    )
}
