'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-community');

export default function GlobalLandingPage() {
  const [suggestedRegion, setSuggestedRegion] = useState<{
    name: string;
    code: string;
  } | null>(null);

  useEffect(() => {
    // To avoid hydration errors, we only run the fetch on the client
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          const countryCode = data.country_code.toLowerCase();
          if (countryCode === 'ng') {
            setSuggestedRegion({ name: 'Nigeria', code: 'ng' });
          } else if (countryCode === 'ca') {
            setSuggestedRegion({ name: 'Canada', code: 'ca' });
          }
        }
      })
      .catch((err) =>
        console.error('Failed to fetch user location:', err)
      );
  }, []);

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
            Empowering Communities, Sustaining Futures
          </h1>
          <p className="mt-4 max-w-3xl text-lg md:text-xl text-primary-foreground">
            SEQHER is a global organization dedicated to fostering sustainable
            development and creating lasting change in alignment with the UN's
            SDGs.
          </p>
        </motion.div>
      </section>

      {/* Portal Selection */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-4">
            Choose Your Region
          </h2>
          <p className="mt-2 mb-10 max-w-2xl mx-auto text-center text-muted-foreground">
            Access resources, programs, and events tailored to your location.
          </p>

          {suggestedRegion && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="max-w-md mx-auto border-primary/50 shadow-lg bg-secondary">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <CardTitle>Suggested Region for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Based on your location, we recommend the{' '}
                    {suggestedRegion.name} portal.
                  </p>
                  <Button asChild className="w-full">
                    <Link href={`/${suggestedRegion.code}`}>
                      Enter the {suggestedRegion.name} Portal
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Link href="/ng" className="block group">
                <Card className="text-center p-8 lg:p-12 h-full hover:shadow-xl hover:border-primary transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="h-6 w-9 rounded-md shadow-md transition-transform group-hover:scale-110">
                            <rect width="900" height="600" fill="#fff"/>
                            <rect width="300" height="600" fill="#008751"/>
                            <rect x="600" width="300" height="600" fill="#008751"/>
                        </svg>
                      Nigeria Portal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Explore local initiatives, opportunities, and resources
                      for Nigeria.
                    </p>
                    <span className="mt-4 inline-flex items-center text-primary font-semibold group-hover:underline">
                        Explore Nigeria <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Link href="/ca" className="block group">
                <Card className="text-center p-8 lg:p-12 h-full hover:shadow-xl hover:border-primary transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center justify-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" className="h-6 w-9 rounded-md shadow-md transition-transform group-hover:scale-110">
                        <rect width="1200" height="600" fill="#fff"/>
                        <rect width="300" height="600" fill="#d52b1e"/>
                        <rect x="900" width="300" height="600" fill="#d52b1e"/>
                        <path fill="#d52b1e" d="M600 400.9l-52.5-30.3-13.3 58.7-41.9-41.9-30.3 52.5-41.9-41.9-58.7 13.3 13.3-58.7-52.5-30.3 52.5-30.3-13.3-58.7 58.7 13.3 41.9-41.9 30.3 52.5 41.9-41.9L547.5 370.6l52.5 30.3zm0-100.9v-52.5h-13.3v52.5l-58.7 58.7V250h-52.5v150h36.1l75-75 75 75h36.1V250h-52.5v50.2l-58.7-58.7z"/>
                      </svg>
                      Canada Portal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Discover programs, events, and ways to get involved in
                      Canada.
                    </p>
                     <span className="mt-4 inline-flex items-center text-primary font-semibold group-hover:underline">
                        Explore Canada <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
