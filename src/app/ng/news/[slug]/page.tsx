import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getNgNewsPost, NG_NEWS_POSTS } from '@/content/news';
import RichText from '@/components/content/RichText';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return NG_NEWS_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props) {
  const post = getNgNewsPost(params.slug);
  if (!post) return { title: 'News Not Found' };
  return { title: `${post.title} | SEQHER News` };
}

export default function NewsDetailPage({ params }: Props) {
  const post = getNgNewsPost(params.slug);
  if (!post) notFound();

  const fallback = PlaceHolderImages.find((p) => p.id === 'news-hero');
  const imageSrc = post.imageUrl || fallback?.imageUrl || null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/ng/news" className="text-sm text-primary hover:underline">
          &larr; Back to News
        </Link>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
        </header>

        {imageSrc && (
          <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-sm">
            <Image src={imageSrc} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-foreground prose-headings:text-primary prose-img:rounded-lg prose-img:shadow-sm">
          <RichText html={post.contentHtml} />
        </div>
      </div>
    </div>
  );
}

