'use client';

import { Calendar, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import type { Project } from '@/content/projects';
import SafeImage from '@/components/ui/safe-image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div key={project.slug} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}>
          <Card className="group h-full overflow-hidden border bg-background/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            {project.imageUrl ? (
              <div className="relative h-44 w-full overflow-hidden">
                <SafeImage
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            ) : null}
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{project.status === 'current' ? 'Current' : 'Past'}</Badge>
                {project.yearLabel ? (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {project.yearLabel}
                  </Badge>
                ) : null}
              </div>
              <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{project.summary}</p>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              {project.funder ? (
                <p className="text-sm">
                  <span className="font-semibold text-foreground">Support:</span>{' '}
                  <span className="text-muted-foreground">{project.funder}</span>
                </p>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default function ProjectsClient({
  currentProjects,
  pastProjects,
}: {
  currentProjects: Project[];
  pastProjects: Project[];
}) {
  return (
    <div className="space-y-14">
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex rounded-lg bg-primary/10 p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="font-headline text-2xl font-bold">Current Projects</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              What we are implementing right now across communities in Nigeria.
            </p>
          </div>
        </div>
        {currentProjects.length ? (
          <ProjectGrid projects={currentProjects} />
        ) : (
          <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">No current projects listed yet.</div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex rounded-lg bg-primary/10 p-2">
            <History className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="font-headline text-2xl font-bold">Past Projects</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Highlights of completed activities and community responses.
            </p>
          </div>
        </div>
        {pastProjects.length ? (
          <ProjectGrid projects={pastProjects} />
        ) : (
          <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">No past projects listed yet.</div>
        )}
      </section>
    </div>
  );
}

