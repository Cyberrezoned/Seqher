'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageId?: string;
  imageUrl?: string | null;
  author: string;
  createdAt: string;
};

const blogHeroImage = PlaceHolderImages.find((p) => p.id === 'blog-hero');

export default function BlogClient({ posts }: { posts: BlogListItem[] }) {
  const authorAvatar = PlaceHolderImages.find((p) => p.id.startsWith('avatar-'));

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
            priority
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
          {posts.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
              <h2 className="text-2xl font-bold font-headline mb-4">No Posts Yet</h2>
              <p>There are no blog posts available at the moment. Check back soon!</p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const postImage = post.imageId ? PlaceHolderImages.find((p) => p.id === post.imageId) : undefined;
                const imageSrc = post.imageUrl || postImage?.imageUrl || null;
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
                        <h2 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground line-clamp-3 flex-grow">{post.excerpt}</p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                          <Avatar>
                            {authorAvatar && <AvatarImage src={authorAvatar.imageUrl} />}
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{post.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                            </p>
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

