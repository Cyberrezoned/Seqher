'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Handshake, Target, Leaf, HeartHandshake, ArrowRight, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Program, Announcement } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase-client';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-community');
const programImage1 = PlaceHolderImages.find(p => p.id === 'program-education');
const programImage2 = PlaceHolderImages.find(p => p.id === 'program-health');

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

export default function NigeriaHomePage() {
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function getFeaturedPrograms(): Promise<Program[]> {
      const { data, error } = await supabase
        .from('programs')
        .select('id,title,summary,description,image_id,sdg_goals,locale')
        .in('locale', ['ng', 'global'])
        .order('title', { ascending: true })
        .limit(3);

      if (error || !data) {
        console.error('Failed to load programs from Supabase:', error);
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        summary: row.summary,
        description: row.description,
        imageId: row.image_id,
        sdgGoals: row.sdg_goals || [],
        locale: (row.locale as Program['locale']) || 'ng',
      }));
    }

    async function getAnnouncements(): Promise<Announcement[]> {
      const { data, error } = await supabase
        .from('announcements')
        .select('id,title,content,locale,created_at')
        .in('locale', ['ng', 'global'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !data) {
        console.error('Failed to load announcements from Supabase:', error);
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        locale: (row.locale as Announcement['locale']) || 'ng',
        createdAt: row.created_at || new Date().toISOString(),
      }));
    }

    getFeaturedPrograms().then(setFeaturedPrograms);
    getAnnouncements().then(setAnnouncements);
  }, []);

  const impactStats = [
    { id: 1, icon: <Handshake className="h-10 w-10 text-primary" />, value: '10,000+', label: 'Lives Impacted' },
    { id: 2, icon: <Target className="h-10 w-10 text-primary" />, value: '15+', label: 'Active Programs' },
    { id: 3, icon: <Leaf className="h-10 w-10 text-primary" />, value: '8', label: 'SDGs Supported' },
    { id: 4, icon: <HeartHandshake className="h-10 w-10 text-primary" />, value: '500+', label: 'Volunteers Engaged' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
            >
            Welcome to SEQHER Nigeria
          </motion.h1>
          <motion.p 
            className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
            >
            Driving localized impact and sustainable solutions across Nigeria.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}
            >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/ng/donate">Donate Now</Link>
                </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
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
              {announcements.map(announcement => (
                <Alert key={announcement.id}>
                  <Megaphone className="h-4 w-4" />
                  <AlertTitle>{announcement.title}</AlertTitle>
                  <AlertDescription>
                    {announcement.content}
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        </motion.section>
      )}


      {/* About Us Section */}
      <motion.section 
        className="py-16 md:py-24 bg-background overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Our Mission in Nigeria</h2>
              <p className="text-lg text-muted-foreground">
                At SEQHER, our mission is to drive impactful change by creating and supporting programs that align with the Sustainable Development Goals (SDGs). We focus on key areas such as education, health, and economic empowerment to build resilient and thriving communities.
              </p>
              <p className="text-muted-foreground">
                We believe in a collaborative approach, working hand-in-hand with local partners and volunteers to ensure our initiatives are both effective and sustainable.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button asChild className="mt-4">
                  <Link href="/ng/about">Learn More <ArrowRight className="ml-2" /></Link>
                </Button>
              </motion.div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                {programImage1 && <Image src={programImage1.imageUrl} alt={programImage1.description} data-ai-hint={programImage1.imageHint} width={400} height={500} className="rounded-lg shadow-lg object-cover aspect-[4/5]"/>}
              </motion.div>
              <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
                 viewport={{ once: true }}
                 className="mt-8"
                >
                {programImage2 && <Image src={programImage2.imageUrl} alt={programImage2.description} data-ai-hint={programImage2.imageHint} width={400} height={500} className="rounded-lg shadow-lg object-cover aspect-[4/5]"/>}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Impact Section */}
      <motion.section 
        className="py-16 md:py-24 bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Impact in Nigeria</h2>
          <p className="mt-2 mb-12 max-w-3xl mx-auto text-muted-foreground">
            Through dedicated effort and generous support, we are making a tangible difference. Here are some of our key achievements.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div 
                key={stat.id} 
                className="flex flex-col items-center"
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
              >
                {stat.icon}
                <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Programs Section */}
      <motion.section 
        className="py-16 md:py-24"
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
              const programImage = PlaceHolderImages.find(p => p.id === program.imageId);
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
                      {programImage && (
                        <div className="overflow-hidden">
                          <Image
                            src={programImage.imageUrl}
                            alt={program.title}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </CardHeader>
                    <div className="p-6 flex flex-col flex-grow">
                        <CardTitle className="font-headline text-xl mb-2 group-hover:text-primary transition-colors">{program.title}</CardTitle>
                        <CardContent className="p-0 flex-grow">
                            <p className="text-muted-foreground line-clamp-3">{program.summary}</p>
                        </CardContent>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                       <Button asChild variant="link" className="p-0 text-primary">
                          <Link href={`/ng/programs/${program.id}`}>Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

       {/* Call to Action Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionVariants}
          >
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg">
              Join us in our mission to create a sustainable and equitable world. Your contribution, big or small, can change lives.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/ng/donate">Donate</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link href="/ng/appointment">Get Involved</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
