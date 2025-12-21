'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, HandHeart, MapPin, Sparkles, Stethoscope, Target, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function PortalMockup({ variant }: { variant: 'ng' | 'ca' }) {
  const isNigeria = variant === 'ng';
  const accent = isNigeria
    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500'
    : 'bg-gradient-to-r from-red-500 via-pink-500 to-violet-500';
  const bg = isNigeria ? 'bg-emerald-500/10' : 'bg-red-500/10';

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border bg-background shadow-sm">
      <div className="flex h-9 items-center gap-2 border-b bg-muted/40 px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        <div className="ml-2 h-2 w-32 rounded-full bg-muted-foreground/20" />
      </div>
      <div className={`p-4 text-left ${bg}`}>
        <div className={`h-2.5 w-28 rounded-full ${accent}`} />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-10 rounded-xl bg-background/70 shadow-sm" />
          <div className="h-10 rounded-xl bg-background/70 shadow-sm" />
          <div className="h-10 rounded-xl bg-background/70 shadow-sm" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-3 rounded-full bg-background/60" />
          <div className="h-3 w-5/6 rounded-full bg-background/60" />
          <div className="h-3 w-2/3 rounded-full bg-background/60" />
        </div>
      </div>
    </div>
  );
}

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
      {/* Mission & Vision */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/25 via-sky-400/20 to-violet-400/25 blur-3xl" />
          <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-gradient-to-br from-pink-400/25 via-amber-300/20 to-indigo-400/25 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-sky-400 via-indigo-500 to-fuchsia-500 opacity-70" />
        </div>

        <div className="container relative mx-auto px-4">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              <span className="text-sm font-medium">Queer‑affirming health • Community • Rights</span>
            </div>

            <h1 className="mt-6 font-headline text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-fuchsia-500 bg-clip-text text-transparent">
                SEQHER
              </span>
            </h1>
            <p className="mt-3 text-muted-foreground">Society for Equal Health and Rights</p>
            <p className="mt-5 text-lg md:text-xl text-foreground/90">
              Care that feels safe. Health that meets you where you are. Rights that don’t require permission.
            </p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <div className="h-full rounded-xl bg-gradient-to-br from-emerald-400 via-sky-400 to-fuchsia-500 p-[1px] shadow-sm">
                <Card className="h-full border-0 bg-background/80 backdrop-blur">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-sm">
                      <Target className="h-5 w-5" />
                    </span>
                    <div className="text-left">
                      <CardTitle>Our Mission</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">What we build, together.</p>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    We close gaps in care and opportunity through inclusive health support, education, economic empowerment,
                    and rights‑forward advocacy — with community safety at the center.
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-300">
                        Queer‑affirming services
                      </span>
                      <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-700 dark:text-sky-300">
                        Health access
                      </span>
                      <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-sm text-fuchsia-700 dark:text-fuchsia-300">
                        Rights & dignity
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="h-full rounded-xl bg-gradient-to-br from-amber-400 via-pink-500 to-indigo-500 p-[1px] shadow-sm">
                <Card className="h-full border-0 bg-background/80 backdrop-blur">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                      <Eye className="h-5 w-5" />
                    </span>
                    <div className="text-left">
                      <CardTitle>Our Vision</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">The future we’re inviting.</p>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    A society where LGBTQ+ people and all communities can access respectful health care, live openly and safely,
                    and thrive — without shame, fear, or exclusion.
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-700 dark:text-amber-300">
                        Safer communities
                      </span>
                      <span className="rounded-full bg-pink-500/10 px-3 py-1 text-sm text-pink-700 dark:text-pink-300">
                        Belonging
                      </span>
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                        Equal rights
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="relative border-t bg-secondary/30 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-sky-400 via-indigo-500 to-fuchsia-500 opacity-60" />
        <div className="container mx-auto px-4">
          <motion.h2 
            className="font-headline text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Select Your Location to Continue
          </motion.h2>
          <motion.p 
            className="mt-2 mb-10 max-w-2xl mx-auto text-center text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            >
            Choose your portal to access programs, updates, and resources tailored to your region — with inclusive, community‑led support.
          </motion.p>

          {suggestedRegion && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
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
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-sm">
                          <Stethoscope className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Health services</span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-sm">
                          <HandHeart className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Safe support</span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                          <Sparkles className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Pride‑affirming</span>
                      </div>
                    </div>

                    <PortalMockup variant="ng" />

                    <span className="mt-6 inline-flex items-center text-primary font-semibold group-hover:underline">
                      Explore Nigeria <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              >
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
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-sm">
                          <Users className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Community</span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm">
                          <Stethoscope className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Wellbeing</span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-sm">
                          <Sparkles className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Inclusive</span>
                      </div>
                    </div>

                    <PortalMockup variant="ca" />

                    <span className="mt-6 inline-flex items-center text-primary font-semibold group-hover:underline">
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
