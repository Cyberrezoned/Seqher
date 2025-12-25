'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Mail, ExternalLink } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import SafeImage from '@/components/ui/safe-image';
import RichText from '@/components/content/RichText';

export type CareerJob = {
  slug: string;
  title: string;
  postedAt: string;
  summary: string;
  imageUrl: string | null;
  applyEmail: string;
  meta: {
    positionTitle: string | null;
    location: string | null;
    contractDuration: string | null;
    releaseDate: string | null;
    applicationDeadline: string | null;
    applySubject: string | null;
  };
  contentHtml: string;
};

function formatSubject(subject: string | null, fallback: string) {
  return subject?.trim() ? subject.trim() : fallback;
}

export default function CareersClient({ jobs }: { jobs: CareerJob[] }) {
  if (!jobs.length) {
    return (
      <Card className="border bg-background/70">
        <CardHeader className="pb-2">
          <p className="text-sm font-semibold text-primary">No openings right now</p>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Please check back soon, or contact us at{' '}
          <a className="underline underline-offset-4" href="mailto:info@seqher.org">
            info@seqher.org
          </a>
          .
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl md:text-3xl font-bold">Current Job Openings</h2>
        <p className="mt-2 text-muted-foreground">Browse roles and apply by email. Click a role to view full details.</p>
      </div>

      <Accordion type="multiple" className="w-full">
        {jobs.map((job) => {
          const subject = formatSubject(job.meta.applySubject, `${job.title} – SEQHER`);
          const mailto = `mailto:${job.applyEmail}?subject=${encodeURIComponent(subject)}`;
          const location = job.meta.location ?? 'Nigeria';
          const deadline = job.meta.applicationDeadline;

          return (
            <AccordionItem key={job.slug} value={job.slug} className="rounded-xl border bg-background/70 px-4 shadow-sm">
              <AccordionTrigger className="py-5 hover:no-underline">
                <div className="flex w-full flex-col items-start gap-2 text-left md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="font-headline text-lg font-bold leading-tight">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.summary}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </Badge>
                    {deadline ? (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Deadline: {deadline}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="grid gap-5 md:grid-cols-[240px_1fr] md:items-start">
                  <div className="space-y-3">
                    {job.imageUrl ? (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted/30">
                        <SafeImage src={job.imageUrl} alt={job.title} fill className="object-cover" />
                      </div>
                    ) : null}

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {job.meta.contractDuration ? (
                        <div className="flex items-start gap-2">
                          <Clock className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            <span className="font-medium text-foreground">Contract:</span> {job.meta.contractDuration}
                          </span>
                        </div>
                      ) : null}
                      {job.meta.releaseDate ? (
                        <div className="flex items-start gap-2">
                          <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            <span className="font-medium text-foreground">Release date:</span> {job.meta.releaseDate}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <a href={mailto}>
                          <Mail className="mr-2 h-4 w-4" />
                          Apply via email
                        </a>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href={`/ng/blog/${job.slug}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open full page
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <RichText
                    content={job.contentHtml}
                    className="prose prose-base max-w-none text-foreground prose-p:text-foreground prose-headings:text-primary prose-strong:text-foreground prose-a:text-primary prose-img:rounded-lg prose-img:shadow-sm"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

