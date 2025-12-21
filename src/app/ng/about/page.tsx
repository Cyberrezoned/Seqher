
'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Flame, Globe, HeartHandshake, Scale, Shield, Users } from 'lucide-react';
import SafeImage from '@/components/ui/safe-image';

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
  const offices = [
    {
      name: 'Headquarter',
      address: 'Behind Monday Lodge, Shagari Low-cost Jere, Maiduguri, Borno State, Nigeria.',
    },
    {
      name: 'Abuja Office',
      address: 'A1 Akaton Homes, Plot 822 Durumi District, Abuja, Nigeria.',
    },
    {
      name: 'Kogi Office',
      address: 'Beside El Bethel Gbeganu, Kogi State, Nigeria.',
    },
  ];

  const contact = {
    name: 'Omeiza Segun Samuel',
    role: 'Executive Director',
    phones: ['+2348064454657', '+2349020484873'],
    email: 'Samsegun01@gmail.com',
    website: 'https://seqher.org',
    social: {
      facebook: 'https://www.facebook.com/share/18rF2QiaNY/',
      instagram: 'https://www.instagram.com/seqherinitiativ?igsh=MTlzdHJsdXFnenkzcg==',
      x: 'https://x.com/Seqherinitiativ?t=OY1j8i25QLbZckBzOpbxqw&s=09',
      tiktok:
        'https://www.tiktok.com/@seqherinitiativ?_r=1&_d=edl9hl31fc8mj0&sec_uid=MS4wLjABAAAAOUJqf4RL6vpml8RkbvyzjpmZT99c8gXMzeJ9SUwacCOeGFaTVWErudFaSlvjP8oj&share_author_id=7377005085425452037&sharer_language=en&source=h5_m&u_code=eee8b92m37m0f2&timestamp=1765958944&user_id=7377005085425452037&sec_user_id=MS4wLjABAAAAOUJqf4RL6vpml8RkbvyzjpmZT99c8gXMzeJ9SUwacCOeGFaTVWErudFaSlvjP8oj&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7576955429353604865&share_link_id=50963718-d4d1-496d-864f-445ab9a11474&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb7360&social_share_type=5&enable_checksum=1',
    },
  };

  const values = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Respect',
      description:
        'We respect everyone, regardless of who they are, and expect the same from partners and team members.',
    },
    {
      icon: <HeartHandshake className="h-10 w-10 text-primary" />,
      title: 'Solidarity',
      description:
        'We stand with people who are treated differently and work to ensure they receive the rights they deserve.',
    },
    {
      icon: <Flame className="h-10 w-10 text-primary" />,
      title: 'Passion',
      description: 'We care deeply about equality and do everything within our power to advance it for all.',
    },
    {
      icon: <Scale className="h-10 w-10 text-primary" />,
      title: 'Justice',
      description:
        'No human should be treated less than another; we speak up, condemn abuses, and defend human rights.',
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: 'Equality',
      description: 'Equality for all — not for some.',
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Courage',
      description: 'We are not afraid to pursue our goals and challenge exclusionary systems and practices.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] w-full bg-primary/20">
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
            Igniting actions that drive change.
          </motion.p>
        </motion.div>
      </section>

      {/* Introduction Section */}
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
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                Society for Equal Health and Rights (SEQHER)
              </h2>
              <p className="text-muted-foreground">
                SEQHER is a non-governmental organization that is sensitive to the plight of minorities who experience
                inequality in our society. We work to address systematic gaps and foster an inclusive and just society.
              </p>
              <div className="rounded-lg border bg-secondary/40 p-5">
                <p className="text-sm font-semibold text-primary">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Our motto is <span className="font-medium text-foreground">“Igniting Actions that drive change.”</span>
                </p>
              </div>
            </div>
            <motion.div
              className="relative aspect-square md:aspect-[4/3] rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {missionImage && (
                <SafeImage
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

      {/* Mission / Vision / Motto */}
      <motion.section
        className="py-16 md:py-24 bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg bg-background p-6 shadow-md">
              <h3 className="font-headline text-xl font-bold text-primary">Our Mission</h3>
              <p className="mt-2 text-muted-foreground">
                Advancing a better world by closing the gaps of inequality through education, economic empowerment,
                human rights, gender and social justice, health and wellbeing, food security, inclusivity, and cultural
                connections.
              </p>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-md">
              <h3 className="font-headline text-xl font-bold text-primary">Our Vision</h3>
              <p className="mt-2 text-muted-foreground">A society where equality thrives.</p>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-md">
              <h3 className="font-headline text-xl font-bold text-primary">Our Motto</h3>
              <p className="mt-2 text-muted-foreground">Igniting Actions that drive change.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Our Values Section */}
      <motion.section
        className="py-16 md:py-24 bg-background"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Focus Areas */}
      <motion.section
        className="py-16 md:py-24 bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">What We Do</h2>
            <p className="mt-3 text-center text-muted-foreground">
              Our work spans health, rights, inclusion, and empowerment — designed to improve quality of life for
              marginalized and vulnerable people.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg bg-background p-6 shadow-md">
                <h3 className="font-headline text-xl font-bold text-primary">Objectives</h3>
                <ul className="mt-3 list-disc pl-5 text-muted-foreground space-y-2">
                  <li>Advocate for human rights and equality for marginalized and vulnerable people.</li>
                  <li>Increase socio-economic capacity of marginalized and vulnerable persons.</li>
                  <li>Promote healthy living and good mental wellbeing.</li>
                  <li>
                    Accelerate life-saving and life-improving innovations for people impacted by conflict, climate change,
                    and other complex emergencies.
                  </li>
                  <li>
                    Advance gender equality and transform unequal power relations by changing exclusionary practices and
                    embedding a culture of change.
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-background p-6 shadow-md">
                <h3 className="font-headline text-xl font-bold text-primary">Thematic Areas</h3>
                <ul className="mt-3 list-disc pl-5 text-muted-foreground space-y-2">
                  <li>Comprehensive Health Promotion and Service Delivery (SRHR, STIs, Mental Health, TB, Malaria).</li>
                  <li>Human Rights, Gender and Social Justice (advocacy, protection, GBV, safety and security).</li>
                  <li>Civic Engagement and Inclusion (leadership development and movement building).</li>
                  <li>Economic Empowerment (vocational and entrepreneurial training).</li>
                  <li>Education (literacy and access for marginalized persons).</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-background p-6 shadow-md">
              <h3 className="font-headline text-xl font-bold text-primary">Strategy</h3>
              <ul className="mt-3 list-disc pl-5 text-muted-foreground space-y-2">
                <li>
                  <span className="font-medium text-foreground">Advocacy:</span> Engage stakeholders to influence policies,
                  laws, norms, and frameworks to be rights-based, inclusive, and gender-sensitive.
                </li>
                <li>
                  <span className="font-medium text-foreground">Lobbying:</span> Build formal and informal collaborations
                  to strengthen grassroots movement, improve tolerance, and expand access.
                </li>
                <li>
                  <span className="font-medium text-foreground">Behavior change &amp; capacity building:</span> Provide
                  psychosocial support and train changemakers through online and in-person initiatives, using local
                  language materials and referral pathways.
                </li>
                <li>
                  <span className="font-medium text-foreground">Communication outreach:</span> Use local languages, social
                  media, and community-friendly professionals to reach youth and underserved communities.
                </li>
                <li>
                  <span className="font-medium text-foreground">Service delivery:</span> Prioritize transparency,
                  confidentiality, and accountability while demystifying harmful stereotypes and promoting dignity.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Offices & Contact */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Offices & Contact</h2>
            <p className="mt-3 text-center text-muted-foreground">
              Reach SEQHER through our offices, phone, email, or official social channels.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {offices.map((office) => (
                <div key={office.name} className="rounded-lg border bg-secondary/30 p-6">
                  <h3 className="font-headline text-lg font-bold text-primary">{office.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{office.address}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg bg-secondary/30 border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-headline text-lg font-bold text-primary">Contact Person</h3>
                  <p className="mt-2 text-muted-foreground">
                    {contact.name} <span className="text-muted-foreground">({contact.role})</span>
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <div className="mt-1 flex flex-col gap-1">
                        {contact.phones.map((p) => (
                          <a key={p} className="text-primary hover:underline" href={`tel:${p.replace(/\s+/g, '')}`}>
                            {p}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="pt-1">
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <a className="text-primary hover:underline" href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </div>
                    <div className="pt-1">
                      <span className="text-muted-foreground">Website:</span>{' '}
                      <a className="text-primary hover:underline" href={contact.website} target="_blank" rel="noreferrer">
                        {contact.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </div>

	                <div>
	                  <h3 className="font-headline text-lg font-bold text-primary">Social Media</h3>
	                  <p className="mt-2 text-sm text-muted-foreground">Official handle: @Seqherinitiativ</p>
	                  <div className="mt-4 flex flex-col gap-2 text-sm">
	                    <a className="text-primary hover:underline" href={contact.social.facebook} target="_blank" rel="noreferrer">
	                      Facebook
	                    </a>
	                    <a className="text-primary hover:underline" href={contact.social.x} target="_blank" rel="noreferrer">
	                      X (Twitter)
	                    </a>
	                    <a className="text-primary hover:underline" href={contact.social.instagram} target="_blank" rel="noreferrer">
	                      Instagram
	                    </a>
	                    <a className="text-primary hover:underline" href={contact.social.tiktok} target="_blank" rel="noreferrer">
	                      TikTok
	                    </a>
	                  </div>
	                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
