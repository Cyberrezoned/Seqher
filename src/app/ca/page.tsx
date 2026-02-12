'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Handshake, Target, Leaf, HeartHandshake, ArrowRight, Shield, Stethoscope, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ORG_MISSION, ORG_VISION } from '@/lib/org-profile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import SafeImage from '@/components/ui/safe-image';

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

type Activity = {
  key: string;
  title: string;
  bullets: readonly string[];
  badge?: string;
};

export default function CanadaHomePage() {
  const canadaOfficeAddress = process.env.NEXT_PUBLIC_CA_OFFICE_ADDRESS || '';

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const impactStats = [
    { id: 1, icon: <Handshake className="h-10 w-10 text-primary" />, value: '1,500+', label: 'People Engaged' },
    { id: 2, icon: <Target className="h-10 w-10 text-primary" />, value: '4', label: 'Pilot Programs' },
    { id: 3, icon: <Leaf className="h-10 w-10 text-primary" />, value: '6', label: 'SDGs Addressed' },
    { id: 4, icon: <HeartHandshake className="h-10 w-10 text-primary" />, value: '120+', label: 'Volunteers' },
  ];

  const navigationCards = [
    {
      title: 'Health Services',
      description: 'Health promotion, wellbeing education, and referral support in Canada.',
      href: '/ca/health-services',
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Safety Support',
      description: 'Confidential support pathways for safety, inclusion, and practical help.',
      href: '/ca/safety-support',
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Community',
      description: 'Community-led activities, partnerships, and updates.',
      href: '/ca/community',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
  ];

  const activities: readonly Activity[] = [
    {
      key: 'health-access-navigation',
      title: 'Health Access & Navigation',
      bullets: [
        'Provide healthcare navigation and referral services to help individuals understand and access available services.',
        'Support people with disabilities to access accessible facilities, assistive devices, and disability-friendly services.',
        'Offer senior-focused navigation (appointments, medication support, and care options).',
        'Support newcomers with guidance to access local healthcare systems, insurance, and primary care providers.',
      ],
    },
    {
      key: 'health-education-awareness',
      title: 'Health Education & Awareness',
      bullets: [
        'Deliver community health education on preventive care, chronic disease management, mental health, SRHR, and nutrition.',
        'Provide accessible health education in multiple formats (plain language, large print, audio, sign language interpretation).',
        'Offer health literacy sessions for seniors, including medication safety and aging-related health issues.',
        "Conduct orientation sessions for newcomers, including how the healthcare system works and patients’ rights.",
      ],
    },
    {
      key: 'disability-inclusion',
      title: 'Disability Inclusion & Support Programs',
      bullets: [
        'Advocate for inclusive and accessible healthcare policies for people with disabilities.',
        'Run disability health support programs (peer support, caregiver education, referrals to rehabilitation services).',
        'Partner with providers to improve physical, communication, and digital accessibility in healthcare settings.',
      ],
    },
    {
      key: 'senior-health-wellness',
      title: 'Senior Health & Wellness Programs',
      bullets: [
        'Organize wellness programs for seniors (physical activity, mental wellness, social engagement).',
        'Provide home-based outreach or mobile support for isolated or mobility-limited seniors.',
        'Offer education on elder rights, long-term care options, and healthy aging.',
      ],
    },
    {
      key: 'newcomer-settlement',
      title: 'Newcomer Settlement & Integration Programs',
      bullets: [
        'Support newcomers with healthcare registration and access, language support/interpretation, and understanding health rights and responsibilities.',
        'Provide culturally responsive health education tailored to diverse communities.',
        'Facilitate community integration activities that promote social inclusion and wellbeing.',
      ],
    },
    {
      key: 'advocacy-policy',
      title: 'Equity-Focused Advocacy & Policy Engagement',
      bullets: [
        'Advocate for policies that reduce disparities based on income, race, gender, disability, age, or immigration status.',
        'Engage policymakers, healthcare institutions, and community leaders to promote inclusive healthcare systems.',
        'Conduct and publish equity-focused research to inform policy and practice.',
      ],
    },
    {
      key: 'outreach-engagement',
      title: 'Community Outreach & Engagement',
      bullets: [
        'Host outreach events, mobile clinics, and information sessions in underserved areas.',
        'Conduct listening sessions with marginalized groups to identify barriers and co-create solutions.',
        'Support peer-led initiatives that strengthen community ownership and trust.',
      ],
    },
    {
      key: 'gender-affirming',
      title: 'Gender-Affirming & Inclusive Health Services',
      badge: 'Gender‑affirming',
      bullets: [
        'Provide gender-affirming health education and referrals within a broader inclusive health framework.',
        'Ensure services are respectful, confidential, and inclusive of all gender identities while remaining accessible to the wider community.',
      ],
    },
    {
      key: 'research-data',
      title: 'Research, Data & Knowledge Sharing',
      bullets: [
        'Conduct community-based research on health disparities affecting underserved populations (including people with disabilities, seniors, and newcomers).',
        'Share findings through reports, workshops, and public education to inform action.',
        'Use data to improve program design and measure impact.',
      ],
    },
    {
      key: 'partnerships-capacity',
      title: 'Partnerships & Capacity Building',
      bullets: [
        'Build collaborations with healthcare providers, disability organizations, senior service agencies, settlement agencies, schools, and community groups.',
        'Provide training for service providers on equity, accessibility, and inclusive care.',
        'Strengthen community organizations through capacity-building and shared resources.',
      ],
    },
    {
      key: 'emergency-crisis',
      title: 'Emergency & Crisis Support',
      bullets: [
        'Offer health-related crisis navigation during public health emergencies.',
        'Provide targeted support for seniors, people with disabilities, and newcomers during emergencies and service disruptions.',
      ],
    },
    {
      key: 'monitoring-evaluation',
      title: 'Monitoring, Evaluation & Continuous Improvement',
      bullets: [
        'Track program outcomes to ensure services are effective, inclusive, and accountable.',
        'Incorporate community feedback to improve service delivery and accountability.',
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-primary/20">
        {heroImage && (
           <SafeImage
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
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/ca/appointment">Get in Touch</Link>
                </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/70 bg-white/15 text-white shadow-[0_14px_32px_rgba(0,0,0,0.35)] backdrop-blur hover:border-white hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <Link href="#navigation">Explore</Link>
                </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        id="navigation"
        className="py-12 md:py-16 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-3">
            {navigationCards.map((item) => (
              <Link key={item.title} href={item.href} className="group block h-full">
                <div className="h-full rounded-xl border bg-background/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2">{item.icon}</div>
                    <div>
                      <h3 className="font-headline text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      <p className="mt-3 inline-flex items-center text-sm font-semibold text-primary">
                        Open page <ArrowRight className="ml-1 h-4 w-4" />
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="purpose"
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-2 items-start">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Purpose &amp; Objective (Canada)</h2>
              <p className="text-muted-foreground">
                The purpose of the Society for Equal Health and Rights is to promote and ensure equitable access to healthcare for all
                individuals, regardless of socio‑economic status, race, gender, or geographic location.
              </p>
              <p className="text-muted-foreground">
                We aim to eliminate disparities in health outcomes by advocating for policies that support equal rights in healthcare,
                providing education and resources to empower underserved communities, and fostering collaborations to build sustainable and
                inclusive healthcare systems.
              </p>
              <p className="text-muted-foreground">
                Through research, outreach, and community engagement, we strive to build a healthier and more equitable world for everyone.
              </p>
            </div>
            <div className="rounded-xl border bg-secondary/30 p-6">
              <h3 className="font-headline text-xl font-bold">Who we support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Women, children, adolescents, school children, people with disabilities, seniors, newcomers, and other underserved
                communities.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {['Women', 'Children', 'Adolescents', 'School children', 'People with disabilities', 'Seniors', 'Newcomers'].map((label) => (
                  <span key={label} className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary text-center">Things We Do</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Activities aligned with our purpose to improve access, inclusion, and health equity.
            </p>

            <Accordion type="multiple" className="mt-8 w-full">
              {activities.map((activity) => (
                <AccordionItem
                  key={activity.key}
                  value={activity.key}
                  className="rounded-xl border bg-background/70 px-4 shadow-sm"
                >
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <div className="flex w-full flex-col items-start gap-2 text-left md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <p className="font-headline text-lg font-bold leading-tight">{activity.title}</p>
                        {activity.badge ? (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-white/20 bg-background/70"
                              style={{
                                backgroundImage:
                                  'linear-gradient(90deg, rgba(244,63,94,0.16), rgba(245,158,11,0.16), rgba(34,197,94,0.16), rgba(14,165,233,0.16), rgba(168,85,247,0.16))',
                              }}
                            >
                              {activity.badge}
                            </Badge>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                      {activity.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </motion.section>

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
                SEQHER’s vision is <span className="font-medium text-foreground">{ORG_VISION}</span> Our mission is{' '}
                <span className="font-medium text-foreground">{ORG_MISSION}</span>
              </p>
              <p className="text-muted-foreground">
                In Canada, we adapt this work to local communities by focusing on environmental stewardship, social equity, and economic innovation. We are actively developing programs, grants, and volunteer opportunities.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button asChild className="mt-4">
                  <Link href="/ca#purpose">Learn More <ArrowRight className="ml-2" /></Link>
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
                {aboutImage1 && (
                  <SafeImage
                    src={aboutImage1.imageUrl}
                    alt={aboutImage1.description}
                    data-ai-hint={aboutImage1.imageHint}
                    width={400}
                    height={500}
                    className="rounded-lg shadow-lg object-cover aspect-[4/5]"
                  />
                )}
              </motion.div>
              <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
                 viewport={{ once: true }}
                 className="mt-8"
                >
                {aboutImage2 && (
                  <SafeImage
                    src={aboutImage2.imageUrl}
                    alt={aboutImage2.description}
                    data-ai-hint={aboutImage2.imageHint}
                    width={400}
                    height={500}
                    className="rounded-lg shadow-lg object-cover aspect-[4/5]"
                  />
                )}
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

      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-xl border bg-secondary/30 p-8">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">Canada contact</h2>
            <p className="mt-2 text-muted-foreground">
              {canadaOfficeAddress ? (
                <span>
                  <span className="font-semibold text-foreground">Address:</span> {canadaOfficeAddress}
                </span>
              ) : (
                'Canada office address will be published soon. In the meantime, reach us using the contacts below.'
              )}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <p>
                Email:{' '}
                <a className="text-primary hover:underline" href="mailto:info@seqher.org">
                  info@seqher.org
                </a>
              </p>
              <p>
                Phone:{' '}
                <a className="text-primary hover:underline" href="tel:+2348064454657">
                  +234 806 445 4657
                </a>{' '}
                /{' '}
                <a className="text-primary hover:underline" href="tel:+2349020484873">
                  +234 902 048 4873
                </a>
              </p>
            </div>
          </div>

          <div id="projects" className="mx-auto mt-10 max-w-4xl rounded-xl border bg-background/70 p-8">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">Past Project (Completed)</h2>
            <p className="mt-3 text-muted-foreground">
              <span className="font-semibold text-foreground">Project title:</span> New Immigrant Healthcare Support Ambassador Project
            </p>
            <p className="mt-2 text-muted-foreground">
              <span className="font-semibold text-foreground">Funding source:</span> Government of Canada — Canada Summer Jobs (CSJ) Program
            </p>
            <p className="mt-4 text-muted-foreground">
              Implemented by the Society for Equal Health and Rights (SEQHER) to address healthcare access challenges faced by new immigrants
              in Canada. The project focused on health education, mental health awareness, and community engagement to support wellbeing and
              integration of newcomers.
            </p>
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
                  <Link href="/ca/appointment">Contact Us</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
