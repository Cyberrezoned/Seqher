
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowRight, Globe } from 'lucide-react';
import { NewsArticle } from '@/lib/types';
import { motion } from 'framer-motion';

const newsHeroImage = PlaceHolderImages.find((p) => p.id === 'news-hero');

// Placeholder data - in a real app, this would come from a CMS or API
const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'UN Report: Urgent Action Needed to Achieve 2030 Climate Goals',
    source: 'UN News',
    publishedDate: '2024-07-20T10:00:00Z',
    summary: 'A landmark report from the IPCC highlights the critical need for accelerated efforts to combat climate change, emphasizing renewable energy and international cooperation.',
    imageUrl: 'https://images.unsplash.com/photo-1611273656184-1de0e35b7b5d?w=800&q=80',
    imageHint: 'wind turbines',
    link: '#',
  },
  {
    id: '2',
    title: 'Global Education Summit Pledges Billions for Quality Education (SDG 4)',
    source: 'UNESCO',
    publishedDate: '2024-07-18T14:30:00Z',
    summary: 'Leaders from around the world have committed to increasing funding for educational initiatives, focusing on access for girls and marginalized communities.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    imageHint: 'students learning',
    link: '#',
  },
  {
    id: '3',
    title: 'Breakthrough in Clean Water Technology Promises Hope for Rural Areas (SDG 6)',
    source: 'World Health Organization',
    publishedDate: '2024-07-15T09:00:00Z',
    summary: 'A new, low-cost water filtration system developed by researchers could provide safe drinking water to millions, tackling a major global health challenge.',
    imageUrl: 'https://images.unsplash.com/photo-1598013324227-39b596813a30?w=800&q=80',
    imageHint: 'clean water',
    link: '#',
  },
  {
    id: '4',
    title: '"Decade of Action" Report Shows Mixed Progress on SDGs',
    source: 'UN DESA',
    publishedDate: '2024-07-12T11:00:00Z',
    summary: 'While significant gains have been made in some areas, the latest Sustainable Development Goals Report warns that the pandemic has reversed progress in others.',
    imageUrl: 'https://images.unsplash.com/photo-1590374246944-32215f9a65c9?w=800&q=80',
    imageHint: 'global goals chart',
    link: '#',
  },
];

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

export default function NewsPage() {
  return (
    <div>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {newsHeroImage && (
          <Image
            src={newsHeroImage.imageUrl}
            alt={newsHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={newsHeroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <motion.div 
            className="relative z-10 text-center text-white p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="font-headline text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            >
                Global News & Activities
            </motion.h1>
          <motion.p 
            className="mt-2 max-w-2xl text-lg text-primary-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            >
            The latest updates on the Sustainable Development Goals from around the world.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="h-full"
                >
                <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <CardHeader className="p-0">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover"
                      data-ai-hint={article.imageHint}
                    />
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-2 font-medium">
                      {article.source} &middot; {format(new Date(article.publishedDate), 'MMM d, yyyy')}
                    </p>
                    <h2 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h2>
                    <p className="text-muted-foreground line-clamp-3 flex-grow">{article.summary}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 mt-auto">
                    <Link href={article.link} className="flex items-center text-primary font-semibold" target="_blank" rel="noopener noreferrer">
                      Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
