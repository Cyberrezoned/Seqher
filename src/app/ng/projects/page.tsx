import Image from 'next/image';

import ProjectsClient from '@/app/ng/projects/ProjectsClient';
import { getNgCurrentProjects, getNgPastProjects } from '@/content/projects';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((p) => p.id === 'programs-hero');

export const dynamic = 'force-static';

export const metadata = {
  title: 'Projects | SEQHER Nigeria',
  description: 'Current and past projects delivered by SEQHER in Nigeria.',
};

export default function ProjectsPage() {
  const currentProjects = getNgCurrentProjects();
  const pastProjects = getNgPastProjects();

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
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Projects in Nigeria</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Transforming vulnerabilities to empowerment.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ProjectsClient currentProjects={currentProjects} pastProjects={pastProjects} />
        </div>
      </section>
    </div>
  );
}

