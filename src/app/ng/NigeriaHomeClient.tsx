'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Handshake, Target, Leaf, HeartHandshake, ArrowRight, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Announcement, Program } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-community');

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function NigeriaHomeClient({
  featuredPrograms,
  announcements,
}: {
  featuredPrograms: Program[];
  announcements: Announcement[];
}) {
  const impactStats = [
    { id: 1, icon: <Handshake className="h-10 w-10 text-primary" />, value: '10,000+', label: 'Lives Impacted' },
    { id: 2, icon: <Target className="h-10 w-10 text-primary" />, value: '15+', label: 'Active Programs' },
    { id: 3, icon: <Leaf className="h-10 w-10 text-primary" />, value: '8', label: 'SDGs Supported' },
    { id: 4, icon: <HeartHandshake className="h-10 w-10 text-primary" />, value: '500+', label: 'Volunteers Engaged' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] w-full bg-primary/20">
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
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="font-headline text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Welcome to SEQHER Nigeria
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Empowering communities with compassion—advancing equal health and rights across Nigeria.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/ng/donate">Donate Now</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/70 bg-white/15 text-white shadow-[0_14px_32px_rgba(0,0,0,0.35)] backdrop-blur hover:border-white hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Link href="/ng/programs">Our Programs</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {announcements.length > 0 && (
        <motion.section
          className="py-8 bg-accent/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
        >
          <div className="container mx-auto px-4">
            {announcements.map((announcement) => (
              <Alert key={announcement.id}>
                <Megaphone className="h-4 w-4" />
                <AlertTitle>{announcement.title}</AlertTitle>
                <AlertDescription>{announcement.content}</AlertDescription>
              </Alert>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        className="py-16 md:py-24 bg-accent/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Featured Programs</h2>
          <p className="mt-2 mb-12 max-w-3xl mx-auto text-center text-muted-foreground">
            Explore some of our key initiatives that are transforming communities and empowering individuals.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program, index) => {
              const programImage = PlaceHolderImages.find((p) => p.id === program.imageId);
              const imageSrc = program.imageUrl || programImage?.imageUrl;
              return (
                <motion.div
                  key={program.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariants}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Card className="group flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                    <CardHeader className="p-0">
                      {imageSrc && (
                        <div className="overflow-hidden">
                          <Image
                            src={imageSrc}
                            alt={program.title}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </CardHeader>
                    <div className="p-6 flex flex-col flex-grow">
                      <CardTitle className="font-headline text-xl mb-2 group-hover:text-primary transition-colors">
                        {program.title}
                      </CardTitle>
                      <CardContent className="p-0 flex-grow">
                        <p className="text-muted-foreground line-clamp-3">{program.summary}</p>
                      </CardContent>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                      <Button asChild variant="link" className="p-0 text-primary">
                        <Link href={`/ng/programs/${program.id}`}>
                          Learn More{' '}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Our Impact</h2>
          <p className="mt-2 mb-12 max-w-3xl mx-auto text-center text-muted-foreground">
            Our work is measured by the positive change we create in communities.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat) => (
              <Card key={stat.id} className="text-center p-6">
                <div className="mx-auto mb-4 w-fit">{stat.icon}</div>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
