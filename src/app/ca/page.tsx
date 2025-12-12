'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-community');

export default function CanadaHomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center bg-primary/20">
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
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to SEQHER Canada
          </h1>
          <p className="mt-4 max-w-3xl text-lg md:text-xl text-primary-foreground">
            Fostering sustainable development and community empowerment across Canada.
          </p>
          <div className="mt-8">
            <Button size="lg" disabled>
              Content Coming Soon
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Our Canadian Portal is Launching Soon</h2>
            <p className="mt-2 mb-10 max-w-2xl mx-auto text-center text-muted-foreground">
                We are working hard to bring localized programs, resources, and events to Canada. Please check back shortly.
            </p>
            <Button asChild>
                <Link href="/">
                    Back to Global Home
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
