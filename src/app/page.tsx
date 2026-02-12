'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Globe2, HeartHandshake, Landmark, Sparkles, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import SafeImage from '@/components/ui/safe-image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ORG_MISSION, ORG_NAME, ORG_VISION } from '@/lib/org-profile';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const regionDetails = {
  ng: {
    label: 'Nigeria',
    home: '/ng',
    donate: '/ng/donate',
    subscribe: '/ng/news',
    description: 'Nigeria country programs, services, grants, and community updates.',
  },
  ca: {
    label: 'Canada',
    home: '/ca',
    donate: '/ca/donate',
    subscribe: '/ca/news',
    description: 'Canada country projects, outreach activities, and international updates.',
  },
} as const;

type Region = keyof typeof regionDetails;

const regionVisuals: Record<
  Region,
  {
    icon: LucideIcon;
    highlight: string;
  }
> = {
  ng: {
    icon: Sparkles,
    highlight: 'from-emerald-500/25 to-cyan-400/20',
  },
  ca: {
    icon: Landmark,
    highlight: 'from-sky-500/25 to-indigo-400/20',
  },
};

const sliderImages = [
  PlaceHolderImages.find((image) => image.id === 'hero-community'),
  PlaceHolderImages.find((image) => image.id === 'program-health'),
  PlaceHolderImages.find((image) => image.id === 'program-education'),
  PlaceHolderImages.find((image) => image.id === 'hero-canada'),
].filter((image): image is (typeof PlaceHolderImages)[number] => Boolean(image));

const impactOverview = [
  'Community-led health and wellbeing services for underserved populations.',
  'Human-rights centered advocacy and inclusive support across both countries.',
  'Partnerships, education, and volunteer action that strengthen local communities.',
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.08,
      duration: 0.45,
      ease: 'easeOut',
    },
  }),
};

function readRegionCookie(): Region | null {
  const regionCookie = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith('seqher_region='))
    ?.split('=')[1];

  if (regionCookie === 'ng' || regionCookie === 'ca') return regionCookie;
  return null;
}

function persistRegionCookie(region: Region) {
  document.cookie = `seqher_region=${region}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

export default function HomePage() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<Region>('ng');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    const regionFromCookie = readRegionCookie();
    if (regionFromCookie) setSelectedRegion(regionFromCookie);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    const autoSlide = window.setInterval(() => {
      carouselApi.scrollPrev();
    }, 4500);

    return () => window.clearInterval(autoSlide);
  }, [carouselApi]);

  const currentRegion = regionDetails[selectedRegion];

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    persistRegionCookie(region);
  };

  const handleRegionOpen = () => {
    persistRegionCookie(selectedRegion);
    router.push(currentRegion.home, { scroll: true });
  };

  return (
    <div className="bg-background">
      <motion.section
        className="container mx-auto px-4 py-10 md:py-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div className="mx-auto max-w-4xl text-center" variants={sectionVariants}>
          <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/10">
            Choose Your Country
          </Badge>
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-5xl">
            Select where you want to get information from
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Browse SEQHER updates, services, and opportunities for Nigeria or Canada.
          </p>
        </motion.div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
          {(Object.keys(regionDetails) as Region[]).map((region, index) => {
            const details = regionDetails[region];
            const isSelected = selectedRegion === region;
            const iconConfig = regionVisuals[region];
            const RegionIcon = iconConfig.icon;

            return (
              <motion.button
                key={region}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleRegionSelect(region)}
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-[0_10px_30px_hsl(var(--primary)/0.16)]'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-lg'
                }`}
                custom={index}
                initial="hidden"
                whileInView="visible"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.995 }}
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
              >
                <span
                  className={`pointer-events-none absolute inset-0 opacity-60 bg-gradient-to-br ${iconConfig.highlight} transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-35 group-hover:opacity-60'
                  }`}
                />
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-primary shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <RegionIcon className="h-5 w-5" />
                    </span>
                    <h3 className="font-headline text-2xl font-bold">{details.label}</h3>
                  </div>
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      Selected
                    </span>
                  ) : null}
                </div>
                <p className="relative z-10 mt-3 text-muted-foreground">{details.description}</p>
                <span className="relative z-10 mt-4 inline-flex items-center text-sm font-semibold text-primary">
                  Set {details.label} as your country <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.div className="mt-8 flex justify-center" variants={sectionVariants}>
          <Button size="lg" onClick={handleRegionOpen} className="min-w-[240px]">
            <Sparkles className="mr-2 h-4 w-4" />
            View {currentRegion.label} Information
          </Button>
        </motion.div>
      </motion.section>

      <motion.section
        id="updates"
        className="bg-secondary/25 py-12 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Globe2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-headline text-2xl font-bold">Community In Action</h3>
              <p className="text-sm text-muted-foreground">4-image slider moving left to right.</p>
            </div>
          </div>

          <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {sliderImages.map((image) => (
                <CarouselItem key={image.id}>
                  <motion.div
                    className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:shadow-xl"
                    whileHover={{ y: -2 }}
                  >
                    <div className="relative aspect-[16/8] w-full">
                      <SafeImage
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority={image.id === sliderImages[0]?.id}
                      />
                    </div>
                    <p className="p-4 text-sm text-muted-foreground">{image.description}</p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </motion.section>

      <motion.section
        id="about-us"
        className="container mx-auto px-4 py-12 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-5xl space-y-6">
          <h3 className="text-center font-headline text-3xl font-bold">About SEQHER</h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Target className="h-5 w-5" />
                </span>
                <CardTitle className="font-headline text-2xl text-primary">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{ORG_VISION}</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <CardTitle className="font-headline text-2xl text-primary">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{ORG_MISSION}</p>
              </CardContent>
            </Card>
          </div>
          <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-3">
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Globe2 className="h-5 w-5" />
              </span>
              <CardTitle className="font-headline text-2xl text-primary">Impact Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{ORG_NAME} creates high-level impact through:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {impactOverview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
