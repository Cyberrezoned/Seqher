import { notFound } from 'next/navigation';
import BlogForm from "../../BlogForm";
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { BlogPost } from '@/lib/types';


type Props = {
    params: Promise<{ id: string }>
}

async function getPost(id: string): Promise<BlogPost | null> {
    const fetchFrom = async (table: string) =>
        supabaseAdmin
            .from(table)
            .select('id,title,content,slug,image_id,author,author_id,locale,created_at')
            .eq('id', id)
            .single();

    // Support both legacy `blogposts` and newer `blog_posts` table names.
    let { data, error } = await fetchFrom('blog_posts');
    if (error) {
        const fallback = await fetchFrom('blogposts');
        data = fallback.data;
        error = fallback.error;
    }

    if (error || !data) {
        console.error('Failed to load blog post from Supabase:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        content: data.content || '',
        slug: data.slug,
        imageId: data.image_id || 'blog-community-gardens',
        author: data.author || 'Unknown',
        authorId: data.author_id || '',
        createdAt: data.created_at || new Date().toISOString(),
        locale: (data.locale as BlogPost['locale']) || 'ng',
    };
}

export default async function EditBlogPostPage({ params }: Props) {
    const { id } = await params;
    const post = await getPost(id);
    if (!post) {
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
