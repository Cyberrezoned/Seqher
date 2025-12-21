'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, MapPin, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">SEQHER</h1>
            <p className="mt-3 text-muted-foreground">
              Society for Equal Health and Rights
            </p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Advancing a better world by closing the gaps of inequality through education, economic empowerment,
                  human rights, gender and social justice, health and wellbeing, food security, inclusivity, and cultural
                  connections.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <CardTitle>Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  A society where equality thrives.
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="border-t bg-secondary/30 py-16 md:py-24">
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
            Choose your portal to access programs, updates, and resources tailored to your region.
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
                    <span className="mt-4 inline-flex items-center text-primary font-semibold group-hover:underline">
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
