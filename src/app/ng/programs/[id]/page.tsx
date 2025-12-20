import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Program } from '@/lib/types';
import { getStaticProgramById, getStaticPrograms } from '@/lib/content/static';
import RichText from '@/components/content/RichText';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = {
  params: Promise<{ id: string }>;
};

async function getProgram(id: string): Promise<Program | null> {
  return getStaticProgramById('ng', id);
}

export async function generateStaticParams() {
  return getStaticPrograms('ng')
    .filter((p) => p.locale === 'ng')
    .map((p) => ({ id: p.id }));
}


export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const program = await getProgram(id);
  if (!program) {
    return { title: 'Program Not Found' };
  }
  return {
    title: `${program.title} | SEQHER`,
    description: program.summary,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { id } = await params;
  const program = await getProgram(id);

  if (!program) {
    notFound();
  }

  const programImage = PlaceHolderImages.find((p) => p.id === program.imageId);
  const imageSrc = program.imageUrl || programImage?.imageUrl;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/ng/programs" className="text-sm text-primary hover:underline">
            &larr; Back to Programs
          </Link>
        </div>

        <article className="space-y-8">
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary">{program.title}</h1>
          
          <div className="flex flex-wrap gap-2">
            {program.sdgGoals.map((goal) => (
              <Badge key={goal} variant="default" className="bg-accent text-accent-foreground">
                SDG {goal}
              </Badge>
            ))}
          </div>

          {imageSrc && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageSrc}
                alt={program.title}
                fill
                className="object-cover"
                data-ai-hint={programImage?.imageHint}
              />
            </div>
          )}

          <p className="lead text-xl text-muted-foreground">{program.summary}</p>
          <RichText
            content={program.description}
            className="prose prose-lg max-w-none text-foreground prose-img:rounded-lg prose-img:shadow-sm"
          />

          <div className="pt-8 border-t">
              <h3 className="font-headline text-2xl font-semibold mb-4">Get Involved</h3>
              <p className="mb-6 text-muted-foreground">Your support can make a real difference in the success of this program and others like it.</p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/ng/donate">Donate Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/ng/appointment">Volunteer</Link>
                </Button>
              </div>
          </div>
        </article>
      </div>
    </div>
  );
}
