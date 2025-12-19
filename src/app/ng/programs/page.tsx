import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-client';
import type { Program } from '@/lib/types';
import { USE_STATIC_CONTENT } from '@/lib/content/config';
import { getStaticPrograms } from '@/lib/content/static';


export const metadata = {
  title: 'Our Programs | SEQHER Nigeria',
  description: 'Explore the various programs and initiatives by SEQHER in Nigeria.',
};

const programsHeroImage = PlaceHolderImages.find(p => p.id === 'programs-hero');

async function getPrograms(): Promise<Program[]> {
  if (USE_STATIC_CONTENT) {
    return getStaticPrograms('ng').filter((p) => p.locale === 'ng');
  }

  const { data, error } = await supabase
    .from('programs')
    .select('id,title,summary,description,image_id,image_url,sdg_goals,locale')
    .eq('locale', 'ng')
    .order('title', { ascending: true });

  if (error || !data) {
    console.error('Failed to load programs from Supabase:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    imageId: row.image_id,
    imageUrl: row.image_url ?? null,
    sdgGoals: row.sdg_goals || [],
    locale: (row.locale as Program['locale']) || 'ng',
  }));
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
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Programs in Nigeria</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Driving change through targeted, sustainable initiatives.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {programs.length === 0 && (
             <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
                <h2 className="text-2xl font-bold font-headline mb-4">No Programs Found</h2>
                <p>There are no programs available at the moment. Check back soon!</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => {
              const programImage = PlaceHolderImages.find(p => p.id === program.imageId);
              const imageSrc = program.imageUrl || programImage?.imageUrl;
              return (
                <Card key={program.id} className="group flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                   <CardHeader className="p-0">
                    {imageSrc && (
                      <div className="overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={program.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={programImage?.imageHint}
                        />
                      </div>
                    )}
                  </CardHeader>
                  <div className="p-6 flex flex-col flex-grow">
                    <CardTitle className="font-headline text-xl mb-2 group-hover:text-primary transition-colors">{program.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {program.sdgGoals.map(goal => (
                            <Badge key={goal} variant="secondary">SDG {goal}</Badge>
                        ))}
                    </div>
                    <CardContent className="p-0 flex-grow">
                      <p className="text-muted-foreground line-clamp-4">{program.summary}</p>
                    </CardContent>
                    <div className="pt-4 mt-auto">
                      <Button asChild variant="link" className="p-0 text-primary">
                          <Link href={`/ng/programs/${program.id}`}>Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
