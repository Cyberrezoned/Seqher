import { notFound } from 'next/navigation';
import BlogForm from "../../BlogForm";
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { BlogPost } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getPost(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .select('id,title,content,slug,image_id,author,author_id,locale,created_at')
        .eq('id', id)
        .single();

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
    const post = await getPost(params.id);
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
