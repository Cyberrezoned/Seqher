import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getNgNewsArticles } from '@/content/news';
import NewsClient from '@/app/ng/news/NewsClient';
import { getStaticBlogPosts } from '@/lib/content/static';
import { makeExcerpt } from '@/lib/content/wp';
import { estimateReadingMinutes, getBlogCategoryLabel } from '@/lib/content/blog-meta';

const newsHeroImage = PlaceHolderImages.find((p) => p.id === 'news-hero');

export const dynamic = 'force-static';

export default function NewsPage() {
  const newsArticles = getNgNewsArticles();
  const storyPosts = getStaticBlogPosts('ng');

  const items = [
    ...newsArticles.map((article) => ({
      id: `news:${article.id}`,
      type: 'news' as const,
      title: article.title,
      summary: article.summary,
      date: article.publishedDate,
      badge: article.category,
      href: article.link,
      imageId: article.imageId,
      imageUrl: article.imageUrl ?? null,
      sourceLabel: article.source,
    })),
    ...storyPosts.map((post) => ({
      id: `story:${post.slug}`,
      type: 'story' as const,
      title: post.title,
      summary: makeExcerpt(post.content, 180),
      date: post.createdAt,
      badge: getBlogCategoryLabel(post.imageId),
      href: `/ng/blog/${post.slug}`,
      imageId: post.imageId ?? '',
      imageUrl: post.imageUrl ?? null,
      sourceLabel: post.author || 'Admin',
      readingMinutes: estimateReadingMinutes(post.content),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {newsHeroImage && (
          <Image
            src={newsHeroImage.imageUrl}
            alt={newsHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={newsHeroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">News & Stories</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Updates, statements, events, and community stories from SEQHER.
          </p>
        </div>
      </section>

      <NewsClient items={items} />
    </div>
  );
}
