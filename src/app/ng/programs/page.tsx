import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Program } from '@/lib/types';
import { getStaticPrograms } from '@/lib/content/static';
import ProgramsClient from './ProgramsClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Our Programs | SEQHER Nigeria',
  description: 'Explore the various programs and initiatives by SEQHER in Nigeria.',
};

const programsHeroImage = PlaceHolderImages.find((p) => p.id === 'programs-hero');

async function getPrograms(): Promise<Program[]> {
  return getStaticPrograms('ng').filter((p) => p.locale === 'ng');
}

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {programsHeroImage && (
          <Image
            src={programsHeroImage.imageUrl}
            alt={programsHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={programsHeroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-primary via-primary/70 to-primary/40 opacity-90" />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Programs in Nigeria</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Transforming Vulnerabilities to empowerment
          </p>
        </div>
      </section>

      <ProgramsClient programs={programs} />
    </div>
  );
}
