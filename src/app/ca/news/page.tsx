import Image from 'next/image';

import NewsClient from '@/app/ng/news/NewsClient';
import { internationalNewsItems } from '@/content/international-news';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const newsHeroImage = PlaceHolderImages.find((p) => p.id === 'news-hero');

export const dynamic = 'force-static';

export default function CanadaNewsPage() {
  const items = [...internationalNewsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <h1 className="font-headline text-4xl md:text-5xl font-bold">International News</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Curated global updates and resources aligned with health equity, inclusion, and human rights.
          </p>
        </div>
      </section>

      <NewsClient items={items} locale="ca" />
    </div>
  );
}

