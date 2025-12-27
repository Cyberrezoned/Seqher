'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Program } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ProgramsClient({ programs }: { programs: Program[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-4xl rounded-xl border bg-primary/5 p-6">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">Community-led services. Built for everyone.</h2>
          <p className="mt-2 text-muted-foreground">
            We create safer pathways to health and rights through confidential, respectful, and community‑led support for women, children,
            adolescents, school children, people with disabilities, and other vulnerable communities.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1">
              <HeartHandshake className="h-4 w-4 text-primary" />
              Compassionate support
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Safety & confidentiality
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1">
              <Sparkles className="h-4 w-4 text-primary" />
              Inclusive care
            </span>
          </div>
        </div>

        {programs.length === 0 && (
          <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
            <h2 className="text-2xl font-bold font-headline mb-4">No Programs Found</h2>
            <p>There are no programs available at the moment. Check back soon!</p>
          </div>
        )}
        {programs.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {programs.map((program) => {
              const programImage = PlaceHolderImages.find((p) => p.id === program.imageId);
              const imageSrc = program.imageUrl || programImage?.imageUrl;
              const isGenderAffirmation = program.id === 'gender-affirming-care';
              return (
                <motion.div key={program.id} variants={itemVariants} className="h-full">
                  <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-xl bg-background/70">
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
                          <div
                            className={
                              isGenderAffirmation
                                ? 'pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-sky-500 to-violet-500 opacity-90'
                                : 'pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/40 opacity-80'
                            }
                          />
                        </div>
                      )}
                    </CardHeader>
                    <div className="p-6 flex flex-col flex-grow">
                      <CardTitle className="font-headline text-xl mb-2 group-hover:text-primary transition-colors">
                        {program.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {program.sdgGoals.map((goal) => (
                          <Badge key={goal} variant="secondary">
                            SDG {goal}
                          </Badge>
                        ))}
                      </div>
                      <CardContent className="p-0 flex-grow">
                        <p className="text-muted-foreground line-clamp-4">{program.summary}</p>
                      </CardContent>
                      <div className="pt-4 mt-auto">
                        <Button asChild variant="link" className="p-0 text-primary">
                          <Link href={`/ng/programs/${program.id}`}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
