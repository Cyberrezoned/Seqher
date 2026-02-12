import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Our Programs | SEQHER Canada',
  description: 'Explore the various programs and initiatives by SEQHER in Canada.',
};

const programsHeroImage = PlaceHolderImages.find(p => p.id === 'programs-hero');

export default function ProgramsPage() {
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
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Programs in Canada</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Driving change through targeted, sustainable initiatives.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
                <h2 className="text-2xl font-bold font-headline mb-4 text-foreground">Programs Under Development</h2>
                <p>
                    Our programs for Canada are currently being developed. 
                    Please check back soon for exciting new initiatives.
                </p>
                 <Button asChild className="mt-6">
                    <Link href="/appointment">
                        Get in Touch
                    </Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
