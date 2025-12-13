
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowRight, Globe } from 'lucide-react';
import type { NewsArticle } from '@/lib/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const newsHeroImage = PlaceHolderImages.find((p) => p.id === 'news-hero');

async function getNewsArticles(): Promise<NewsArticle[]> {
  const newsQuery = query(collection(db, 'news'), orderBy('publishedDate', 'desc'));
  const snapshot = await getDocs(newsQuery);
  const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          publishedDate: data.publishedDate?.toDate ? data.publishedDate.toDate().toISOString() : new Date().toISOString(),
      } as NewsArticle
  });
  return list;
}


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
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        getNewsArticles().then(setNewsArticles);
    }, []);

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
            {newsArticles.map((article, index) => {
               const articleImage = PlaceHolderImages.find((p) => p.id === article.imageId);
               return (
              <motion.div
                key={article.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="h-full flex"
                >
                <Card className="flex flex-col h-full w-full overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <CardHeader className="p-0">
                    {articleImage && (
                        <Image
                        src={articleImage.imageUrl}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover"
                        data-ai-hint={articleImage.imageHint}
                        />
                    )}
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
            )})}
          </div>
           {newsArticles.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No news articles found. Check back later!
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
