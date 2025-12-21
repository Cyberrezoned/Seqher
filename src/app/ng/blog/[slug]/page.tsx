import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { BlogPost } from '@/lib/types';
import { getStaticBlogPostBySlug, getStaticBlogPosts } from '@/lib/content/static';
import RichText from '@/components/content/RichText';
import SafeImage from '@/components/ui/safe-image';
import { estimateReadingMinutes, getBlogCategoryLabel } from '@/lib/content/blog-meta';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getStaticBlogPosts('ng')
    .filter((p) => p.locale === 'ng')
    .map((p) => ({ slug: p.slug }));
}

async function getPost(slug: string): Promise<BlogPost | null> {
  return getStaticBlogPostBySlug('ng', slug);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | SEQHER Blog`,
    description: post.content.substring(0, 150),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const postImage = PlaceHolderImages.find((p) => p.id === post.imageId);
  const imageSrc = post.imageUrl || postImage?.imageUrl;
  const authorAvatar = PlaceHolderImages.find(p => p.id.startsWith('avatar-'));
  const readingMinutes = estimateReadingMinutes(post.content);
  const category = getBlogCategoryLabel(post.imageId);

  const relatedPosts = getStaticBlogPosts('ng')
    .filter((p) => p.slug !== post.slug)
    .filter((p) => getBlogCategoryLabel(p.imageId) === category)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <article className="space-y-8">
            <div className="space-y-4 text-center">
                <Link href="/ng/blog" className="text-sm text-primary hover:underline">
                    &larr; Back to Blog
                </Link>
                <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight">{post.title}</h1>
                <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground">
                    <span className="inline-flex items-center rounded-full border bg-muted/60 px-3 py-1 text-xs font-semibold tracking-wide text-foreground">
                      {category}
                    </span>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            {authorAvatar && <AvatarImage src={authorAvatar.imageUrl} />}
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{post.author}</span>
                    </div>
                    <span>&middot;</span>
                    <time dateTime={post.createdAt}>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
                    <span>&middot;</span>
                    <span>{readingMinutes} min read</span>
                </div>
            </div>
            
            {imageSrc && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                <SafeImage
                    src={imageSrc}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint={postImage?.imageHint}
                    priority
                />
                </div>
            )}

            <RichText
              content={post.content}
              className="prose prose-lg max-w-none text-foreground prose-p:text-foreground prose-headings:text-primary prose-strong:text-foreground prose-a:text-primary prose-img:rounded-lg prose-img:shadow-sm"
            />
            
            <Separator />
            
            <div className="text-center">
                <h3 className="font-headline text-xl font-bold mb-2">Join the Conversation</h3>
                <p className="text-muted-foreground mb-4">Support our work to advance equal health and rights.</p>
                <Link href="/ng/donate" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-lg font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
                    Donate Now
                </Link>
            </div>

            {relatedPosts.length > 0 ? (
              <section className="pt-6">
                <h3 className="font-headline text-2xl font-bold mb-4 text-center">More in {category}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedPosts.map((p) => {
                    const pImage = PlaceHolderImages.find((img) => img.id === p.imageId);
                    const pSrc = p.imageUrl || pImage?.imageUrl || null;
                    return (
                      <Link key={p.slug} href={`/ng/blog/${p.slug}`} className="group">
                        <Card className="h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                          <CardHeader className="p-0">
                            {pSrc ? (
                              <SafeImage
                                src={pSrc}
                                alt={p.title}
                                width={600}
                                height={338}
                                className="h-36 w-full object-cover"
                                data-ai-hint={pImage?.imageHint}
                              />
                            ) : null}
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                              {p.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {format(new Date(p.createdAt), 'MMM d, yyyy')}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}
        </article>
      </div>
    </div>
  );
}
