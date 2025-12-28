import Image from 'next/image';

import { getStaticBlogPosts } from '@/lib/content/static';
import { htmlToText, makeExcerpt } from '@/lib/content/wp';
import CareersClient, { type CareerJob } from '@/app/ng/careers/CareersClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Careers | SEQHER Nigeria',
  description: 'Explore job openings and opportunities at SEQHER in Nigeria.',
};

function extractJobMeta(content: string) {
  const text = htmlToText(content);
  const pick = (label: string) => {
    const re = new RegExp(`${label}:\\s*([^]+?)(?=\\s+(?:Position Title:|Location:|Contract Duration:|Release Date:|Application Deadline:|About SEQHER|Position Summary|Key Responsibilities|Required Qualifications|Preferred Candidate Profile|How to Apply)\\b|$)`, 'i');
    const match = text.match(re);
    return match?.[1]?.trim() ?? null;
  };

  const subjectMatch = text.match(/subject line:\s*(?:“|")([^”"]+)(?:”|")/i);

  return {
    positionTitle: pick('Position Title') ?? null,
    location: pick('Location') ?? null,
    contractDuration: pick('Contract Duration') ?? null,
    releaseDate: pick('Release Date') ?? null,
    applicationDeadline: pick('Application Deadline') ?? null,
    applySubject: subjectMatch?.[1]?.trim() ?? null,
  };
}

export default function CareersPage() {
  const jobs = getStaticBlogPosts('ng')
    .filter((p) => p.locale === 'ng')
    .filter((p) => p.slug.startsWith('open-position-for-'))
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const careerJobs: CareerJob[] = jobs.map((job) => {
    const meta = extractJobMeta(job.content);
    const title = (meta.positionTitle ?? job.title.replace(/^Open Position (For|for)\s+/i, '').trim()) || job.title;
    return {
      slug: job.slug,
      title,
      postedAt: job.createdAt,
      summary: makeExcerpt(job.content, 190),
      imageUrl: job.imageUrl ?? null,
      meta,
      contentHtml: job.content,
      applyEmail: 'job@seqher.org',
      };
  });

  const heroImage =
    careerJobs.find((j) => j.imageUrl)?.imageUrl ??
    'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1600&h=900&q=80';

  return (
    <div className="bg-background">
      <section className="relative h-[45vh] min-h-[320px] w-full bg-primary/15 flex items-center justify-center">
        <Image src={heroImage} alt="SEQHER careers" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-4">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm">Join the Mission</p>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mt-3">Careers at SEQHER</h1>
          <p className="mt-3 max-w-3xl mx-auto text-primary-foreground text-lg">
            {careerJobs.length ? (
              <>
                Current openings: <span className="font-semibold">{careerJobs.length}</span> role{careerJobs.length === 1 ? '' : 's'}.
              </>
            ) : (
              <>No openings are listed right now. Please check back soon.</>
            )}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          <CareersClient jobs={careerJobs} />
        </div>
      </section>
    </div>
  );
}
