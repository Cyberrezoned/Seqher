import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getNgNewsArticles } from '@/content/news';
import NewsClient from '@/app/ng/news/NewsClient';

const newsHeroImage = PlaceHolderImages.find((p) => p.id === 'news-hero');

export const dynamic = 'force-static';

export default function NewsPage() {
    const newsArticles = getNgNewsArticles();

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
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Global News & Activities</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Updates, statements, events, and opportunities from SEQHER.
          </p>
        </div>
      </section>

      <NewsClient articles={newsArticles} />
    </div>
  );
}
