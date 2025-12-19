'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { BlogPost } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import { USE_STATIC_CONTENT } from '@/lib/content/config';
import { getStaticBlogPosts } from '@/lib/content/static';
import { makeExcerpt } from '@/lib/content/wp';

const blogHeroImage = PlaceHolderImages.find(p => p.id === 'blog-hero');

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        if (USE_STATIC_CONTENT) {
            setLoading(true);
            setBlogPosts(getStaticBlogPosts('ng'));
            setLoading(false);
            return;
        }

        async function getBlogPosts(): Promise<BlogPost[]> {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('id,title,content,slug,image_id,image_url,author,author_id,locale,created_at')
                .eq('locale', 'ng')
                .order('created_at', { ascending: false });

            if (error || !data) {
                const err: any = error;
                console.error('Failed to load blog posts from Supabase:', {
                    message: err?.message,
                    code: err?.code,
                    details: err?.details,
                    hint: err?.hint,
                    keys: err ? Object.getOwnPropertyNames(err) : null,
                });
                return getStaticBlogPosts('ng');
            }

            return data.map((row) => ({
                id: row.id,
                title: row.title,
                content: row.content || '',
                slug: row.slug,
                imageId: row.image_id || 'blog-community-gardens',
                imageUrl: row.image_url ?? null,
                author: row.author || 'Admin',
                authorId: row.author_id || '',
                createdAt: row.created_at || new Date().toISOString(),
                locale: (row.locale as BlogPost['locale']) || 'ng',
            }));
        }

        async function loadBlog() {
            setLoading(true);
            const posts = await getBlogPosts();
            setBlogPosts(posts);
            setLoading(false);
        }

        loadBlog();

    }, []);


  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {blogHeroImage && (
          <Image
            src={blogHeroImage.imageUrl}
            alt={blogHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={blogHeroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">SEQHER Blog - Nigeria</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Stories of impact, community voices, and organizational updates.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({length: 3}).map((_, i) => (
                    <Card key={i} className="flex flex-col h-full overflow-hidden">
                        <CardHeader className="p-0">
                           <Skeleton className="w-full h-48" />
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col flex-grow">
                             <Skeleton className="h-6 w-3/4 mb-4" />
                             <Skeleton className="h-4 w-full mb-2" />
                             <Skeleton className="h-4 w-full mb-2" />
                             <Skeleton className="h-4 w-2/3" />
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                     <Skeleton className="h-4 w-24" />
                                     <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
          )}
          {!loading && blogPosts.length === 0 && (
             <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
                <h2 className="text-2xl font-bold font-headline mb-4">No Posts Yet</h2>
                <p>There are no blog posts available at the moment. Check back soon!</p>
            </div>
          )}
          {!loading && blogPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => {
                const postImage = PlaceHolderImages.find((p) => p.id === post.imageId);
                const imageSrc = post.imageUrl || postImage?.imageUrl;
                const authorAvatar = PlaceHolderImages.find(p => p.id.startsWith('avatar-'));

                return (
                    <Link key={post.id} href={`/ng/blog/${post.slug}`} className="group">
                    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="p-0">
                        {imageSrc && (
                            <Image
                            src={imageSrc}
                            alt={post.title}
                            width={400}
                            height={225}
                            className="w-full h-48 object-cover"
                            data-ai-hint={postImage?.imageHint}
                            />
                        )}
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col flex-grow">
                        <h2 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                        <p className="text-muted-foreground line-clamp-3 flex-grow">{makeExcerpt(post.content, 180)}</p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                            <Avatar>
                            {authorAvatar && <AvatarImage src={authorAvatar.imageUrl} />}
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="text-sm font-medium">{post.author}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    </Link>
                );
                })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
