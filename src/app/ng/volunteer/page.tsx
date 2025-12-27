import Image from 'next/image';

import VolunteerForm from '@/app/volunteer/VolunteerForm';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((p) => p.id === 'appointment-hero');

export const dynamic = 'force-static';

export default function VolunteerPage() {
  return (
    <>
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Volunteer</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Join SEQHER’s work through compassionate, community-led action.
          </p>
        </div>
      </section>

      <div className="container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <VolunteerForm locale="ng" />
        </div>
      </div>
    </>
  );
}
