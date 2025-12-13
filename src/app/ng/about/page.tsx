
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Users, Globe, Target } from 'lucide-react';

const heroImage = PlaceHolderImages.find((p) => p.id === 'about-hero');
const missionImage = PlaceHolderImages.find((p) => p.id === 'about-mission');

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function AboutPage() {
  const values = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: 'Global Goals, Local Action',
      description: 'We align our work with the UN SDGs, adapting them to create tangible impact within local communities.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Community-Centric',
      description: 'Our approach is collaborative, putting the needs and voices of the communities we serve at the forefront.',
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: 'Sustainable Impact',
      description: 'We are committed to creating lasting, self-sufficient change that empowers future generations.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] w-full bg-primary/20">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30" />
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="font-headline text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            About SEQHER
          </motion.h1>
          <motion.p
            className="mt-4 max-w-3xl text-lg md:text-xl text-primary-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            Fostering sustainable development and empowering communities worldwide.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Mission Section */}
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
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                Our mission is to catalyze and support initiatives that align with the United Nations Sustainable Development Goals (SDGs). We are dedicated to empowering communities by focusing on critical areas such as education, healthcare, economic opportunity, and environmental stewardship.
              </p>
              <p className="text-muted-foreground">
                We believe in the power of collaboration and partnership. By working closely with local stakeholders, volunteers, and global partners, we ensure our projects are not only effective but also culturally relevant and sustainable for the long term. Our goal is to build resilient communities that can thrive for generations to come.
              </p>
            </div>
            <motion.div
              className="relative aspect-square md:aspect-[4/3] rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {missionImage && (
                <Image
                  src={missionImage.imageUrl}
                  alt={missionImage.description}
                  data-ai-hint={missionImage.imageHint}
                  fill
                  className="object-cover"
                />
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values Section */}
      <motion.section
        className="py-16 md:py-24 bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Core Values</h2>
          <p className="mt-2 mb-12 max-w-3xl mx-auto text-muted-foreground">
            The principles that guide every action we take and every program we build.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="flex flex-col items-center p-6 bg-background rounded-lg shadow-md"
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
              >
                {value.icon}
                <h3 className="mt-4 text-xl font-bold font-headline">{value.title}</h3>
                <p className="mt-2 text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
