import Image from 'next/image';

import GrantsClient from '@/app/ng/grants/GrantsClient';
import { NG_GRANTS } from '@/content/grants';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((p) => p.id === 'news-hero');

export const dynamic = 'force-static';

export default function GrantsPage() {
  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Grants &amp; Funding Opportunities</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Stay informed about funding opportunities that support community-led work and impact.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <GrantsClient grants={NG_GRANTS} />
        </div>
      </section>
    </div>
  );
}

