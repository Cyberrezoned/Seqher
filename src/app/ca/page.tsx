'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Handshake, Target, Leaf, HeartHandshake, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-canada');
const aboutImage1 = PlaceHolderImages.find(p => p.id === 'about-canada-1');
const aboutImage2 = PlaceHolderImages.find(p => p.id === 'about-canada-2');

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

export default function CanadaHomePage() {

  const impactStats = [
    { id: 1, icon: <Handshake className="h-10 w-10 text-primary" />, value: '1,500+', label: 'People Engaged' },
    { id: 2, icon: <Target className="h-10 w-10 text-primary" />, value: '4', label: 'Pilot Programs' },
    { id: 3, icon: <Leaf className="h-10 w-10 text-primary" />, value: '6', label: 'SDGs Addressed' },
    { id: 4, icon: <HeartHandshake className="h-10 w-10 text-primary" />, value: '120+', label: 'Volunteers' },
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
            SEQHER in Canada
          </motion.h1>
          <motion.p 
            className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
            >
            Fostering sustainable development and community empowerment across Canada.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}
            >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled>
                  <Link href="#">Donate (Coming Soon)</Link>
                </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10" disabled>
                  <Link href="#">Our Programs</Link>
                </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

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
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Our Vision for Canada</h2>
              <p className="text-lg text-muted-foreground">
                SEQHER Canada is committed to adapting our global mission to the unique context of Canadian communities. We focus on environmental stewardship, social equity, and economic innovation in line with the UN's Sustainable Development Goals.
              </p>
              <p className="text-muted-foreground">
                Our goal is to build partnerships that foster resilience and create a sustainable future for all Canadians. The portal for Canadian programs, grants, and volunteer opportunities is currently under development.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button asChild className="mt-4" disabled>
                  <Link href="#">Learn More <ArrowRight className="ml-2" /></Link>
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
                {aboutImage1 && <Image src={aboutImage1.imageUrl} alt={aboutImage1.description} data-ai-hint={aboutImage1.imageHint} width={400} height={500} className="rounded-lg shadow-lg object-cover aspect-[4/5]"/>}
              </motion.div>
              <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
                 viewport={{ once: true }}
                 className="mt-8"
                >
                {aboutImage2 && <Image src={aboutImage2.imageUrl} alt={aboutImage2.description} data-ai-hint={aboutImage2.imageHint} width={400} height={500} className="rounded-lg shadow-lg object-cover aspect-[4/5]"/>}
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
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Initial Impact</h2>
           <p className="mt-2 mb-12 max-w-3xl mx-auto text-muted-foreground">
            We are just getting started in Canada, but we are already making progress towards a more sustainable future.
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

      {/* Coming Soon Section */}
       <motion.section 
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
           <h2 className="font-headline text-3xl md:text-4xl font-bold">Features Coming Soon</h2>
            <p className="mt-2 mb-12 max-w-3xl mx-auto text-muted-foreground">
                We're actively developing a full suite of resources for our Canadian partners and volunteers.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-bold font-headline mb-2">Grant & Funding Opportunities</h3>
                    <p className="text-muted-foreground">Access a database of grants available for sustainability and community projects in Canada.</p>
                </div>
                 <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-bold font-headline mb-2">Volunteer Pathways</h3>
                    <p className="text-muted-foreground">Find local and national volunteer opportunities that match your skills and passion.</p>
                </div>
                 <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-bold font-headline mb-2">Compliance & Resources</h3>
                    <p className="text-muted-foreground">Browse documentation and resources relevant to Canadian non-profits and charities.</p>
                </div>
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
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Partner with Us in Canada</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg">
             Interested in collaborating or learning more about our upcoming Canadian initiatives? Get in touch!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link href="/appointment">Contact Us</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
