'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, MapPin, Sparkles, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Logo from '@/components/icons/Logo';
import { ORG_MISSION, ORG_MOTTO, ORG_VISION } from '@/lib/org-profile';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function GlobalLandingPage() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const [suggestedRegion, setSuggestedRegion] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const taglines = [
    ORG_MOTTO,
    'Equality for all — not for some.',
    ORG_VISION,
    'Respect • Solidarity • Courage.',
  ] as const;
  const [taglineIndex, setTaglineIndex] = useState(0);

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

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = window.setInterval(() => {
      setTaglineIndex((i) => (i + 1) % taglines.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, taglines.length]);

  const setRegionAndGo = (region: 'ng' | 'ca') => {
    document.cookie = `seqher_region=${region}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${region}`);
  };

  return (
    <div className="flex flex-col">
      {/* Country Selection */}
      <section className="relative overflow-hidden bg-secondary/30 py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.14),transparent_70%)] blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40 opacity-70" />
        </div>

        <div className="container relative mx-auto px-4">
          <motion.h2
            className="font-headline text-3xl md:text-4xl font-bold text-center mb-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nigeria or Canada
          </motion.h2>
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            Select your country to continue.
          </motion.p>

          {suggestedRegion && (
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="transform-gpu"
                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, -3, 0, 3, 0],
                        rotateX: [0, 1.2, 0, -1.2, 0],
                        rotateY: [0, -1.4, 0, 1.4, 0],
                      }
                }
                transition={shouldReduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                whileHover={shouldReduceMotion ? undefined : { y: -8, rotateX: 0, rotateY: 0, scale: 1.015 }}
              >
                <Card className="max-w-md mx-auto border-primary/50 shadow-lg bg-secondary">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                    <CardTitle>Suggested for you</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Based on your location, we recommend {suggestedRegion.name}.</p>
                    <Button className="w-full" onClick={() => setRegionAndGo(suggestedRegion.code === 'ca' ? 'ca' : 'ng')}>
                      Open {suggestedRegion.name}
                      <ArrowRight className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <motion.div
                className="h-full transform-gpu"
                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
                animate={shouldReduceMotion ? undefined : { y: [0, -3, 0, 3, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.02, rotateX: 0, rotateY: 0, transition: { duration: 0.2 } }}
              >
                <button
                  type="button"
                  className="block w-full text-left group"
                  onClick={() => setRegionAndGo('ng')}
                >
                  <Card className="text-center p-8 lg:p-12 h-full hover:shadow-xl hover:border-primary transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl font-headline flex items-center justify-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 900 600"
                          className="h-6 w-9 rounded-md shadow-md transition-transform group-hover:scale-110"
                        >
                          <rect width="900" height="600" fill="#fff" />
                          <rect width="300" height="600" fill="#008751" />
                          <rect x="600" width="300" height="600" fill="#008751" />
                        </svg>
                        Nigeria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Explore services, projects, updates, and ways to get involved in Nigeria.
                      </p>
                      <span className="mt-6 inline-flex items-center text-primary font-semibold group-hover:underline">
                        Continue <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div
                className="h-full transform-gpu"
                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
                animate={shouldReduceMotion ? undefined : { y: [0, 3, 0, -3, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.55 }}
                whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.02, rotateX: 0, rotateY: 0, transition: { duration: 0.2 } }}
              >
                <button
                  type="button"
                  className="block w-full text-left group"
                  onClick={() => setRegionAndGo('ca')}
                >
                  <Card className="text-center p-8 lg:p-12 h-full hover:shadow-xl hover:border-primary transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl font-headline flex items-center justify-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1200 600"
                          className="h-6 w-9 rounded-md shadow-md transition-transform group-hover:scale-110"
                        >
                          <rect width="1200" height="600" fill="#fff" />
                          <rect width="300" height="600" fill="#d52b1e" />
                          <rect x="900" width="300" height="600" fill="#d52b1e" />
                          <path
                            fill="#d52b1e"
                            d="M600 400.9l-52.5-30.3-13.3 58.7-41.9-41.9-30.3 52.5-41.9-41.9-58.7 13.3 13.3-58.7-52.5-30.3 52.5-30.3-13.3-58.7 58.7 13.3 41.9-41.9 30.3 52.5 41.9-41.9L547.5 370.6l52.5 30.3zm0-100.9v-52.5h-13.3v52.5l-58.7 58.7V250h-52.5v150h36.1l75-75 75 75h36.1V250h-52.5v50.2l-58.7-58.7z"
                          />
                        </svg>
                        Canada
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Explore services, projects, updates, and ways to get involved in Canada.
                      </p>
                      <span className="mt-6 inline-flex items-center text-primary font-semibold group-hover:underline">
                        Continue <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-gradient-to-br from-primary/18 via-primary/10 to-primary/22 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40 opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        </div>

        <div className="container relative mx-auto px-4">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground/90 sm:text-sm">
                Society for Equal Health and Rights
              </span>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  className="relative h-14 w-14"
                  style={{ perspective: 900 }}
                  initial={{ opacity: 0, scale: 0.9, rotateX: 12, rotateY: -10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateX: [0, 10, 0, -10, 0],
                    rotateY: [0, -12, 0, 12, 0],
                    y: [0, -2, 0, 2, 0],
                  }}
                  whileHover={{ scale: 1.06, rotateX: 0, rotateY: 0 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.28),transparent_65%)] blur-md" />
                  <Logo className="relative h-14 w-14 text-primary drop-shadow-[0_18px_35px_hsl(var(--primary)/0.22)]" aria-hidden="true" />
                </motion.div>

                <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
                  <motion.span
                    className="bg-gradient-to-r from-primary via-primary/80 to-primary/55 bg-clip-text text-transparent drop-shadow-[0_18px_30px_hsl(var(--primary)/0.22)]"
                    style={{ backgroundSize: '200% 200%' }}
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    SEQHER
                  </motion.span>
                </h1>
              </div>

              <div className="mt-3 text-sm text-muted-foreground">
                {shouldReduceMotion ? (
                  <span>{taglines[0]}</span>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={taglineIndex}
                      className="inline-block"
                      initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      {taglines[taglineIndex]}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
	            >
	              <motion.div
	                className="group h-full transform-gpu"
	                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
	                animate={
	                  shouldReduceMotion
	                    ? undefined
                    : {
                        y: [0, -4, 0, 4, 0],
                        rotateX: [0, 2, 0, -2, 0],
                        rotateY: [0, -2.5, 0, 2.5, 0],
                      }
                }
	                transition={shouldReduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
	                whileHover={shouldReduceMotion ? undefined : { y: -10, rotateX: 0, rotateY: 0, scale: 1.02 }}
	              >
	                <div className="h-full rounded-xl bg-gradient-to-br from-primary via-primary/70 to-primary/40 p-[1px] shadow-sm transition-shadow duration-300 group-hover:shadow-[0_24px_70px_hsl(var(--primary)/0.18)]">
	                  <Card className="h-full border-0 bg-background/80 backdrop-blur transition-colors duration-300 group-hover:bg-background/90 group-hover:ring-1 group-hover:ring-primary/15">
	                    <CardHeader className="flex flex-row items-center gap-3">
	                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/55 text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-[1.06]">
	                        <Target className="h-5 w-5" />
	                      </span>
	                      <div className="text-left">
	                        <CardTitle>Our Mission</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">What we build, together.</p>
                      </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
	                      {ORG_MISSION}
	                      <div className="mt-5 flex flex-wrap gap-2">
	                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-colors duration-300 group-hover:bg-primary/15">
	                          Respect & dignity
	                        </span>
	                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-colors duration-300 group-hover:bg-primary/15">
	                          Health access
	                        </span>
	                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-colors duration-300 group-hover:bg-primary/15">
	                          Rights & justice
	                        </span>
	                      </div>
	                    </CardContent>
	                  </Card>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
	            >
	              <motion.div
	                className="group h-full transform-gpu"
	                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
	                animate={
	                  shouldReduceMotion
	                    ? undefined
                    : {
                        y: [0, 4, 0, -4, 0],
                        rotateX: [0, -2, 0, 2, 0],
                        rotateY: [0, 2.5, 0, -2.5, 0],
                      }
                }
	                transition={shouldReduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
	                whileHover={shouldReduceMotion ? undefined : { y: -10, rotateX: 0, rotateY: 0, scale: 1.02 }}
	              >
	                <div className="h-full rounded-xl bg-gradient-to-br from-primary via-primary/70 to-primary/40 p-[1px] shadow-sm transition-shadow duration-300 group-hover:shadow-[0_24px_70px_hsl(var(--primary)/0.18)]">
	                  <Card className="h-full border-0 bg-background/80 backdrop-blur transition-colors duration-300 group-hover:bg-background/90 group-hover:ring-1 group-hover:ring-primary/15">
	                    <CardHeader className="flex flex-row items-center gap-3">
	                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/55 text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-[1.06]">
	                        <Eye className="h-5 w-5" />
	                      </span>
	                      <div className="text-left">
	                        <CardTitle>Our Vision</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">The future we’re inviting.</p>
                      </div>
                    </CardHeader>
	                    <CardContent className="text-muted-foreground">
	                      {ORG_VISION}
	                      <div className="mt-5 flex flex-wrap gap-2">
	                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-colors duration-300 group-hover:bg-primary/15">
	                          Safer communities
	                        </span>
	                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-colors duration-300 group-hover:bg-primary/15">
	                          Solidarity
	                        </span>
	                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-colors duration-300 group-hover:bg-primary/15">
	                          Equality
	                        </span>
	                      </div>
	                    </CardContent>
	                  </Card>
	                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-xl border bg-background/70 p-6">
            <h2 className="font-headline text-xl font-bold text-primary">Who we serve</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our work includes women, children, adolescents, school children, people with disabilities, displaced persons, and other
              marginalized and vulnerable communities.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {[
                'Women',
                'Children',
                'Adolescents',
                'School children',
                'People with disabilities',
                'Displaced persons',
                'Vulnerable communities',
                'Gender-diverse persons',
              ].map((label) => (
                <span key={label} className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
