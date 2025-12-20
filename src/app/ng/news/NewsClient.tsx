'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import type { NewsArticle } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SafeImage from '@/components/ui/safe-image';

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

export default function NewsClient({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => {
            const articleImage = PlaceHolderImages.find((p) => p.id === article.imageId);
            const imageSrc = article.imageUrl || articleImage?.imageUrl;
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
                <Card className="flex flex-col h-full w-full overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <CardHeader className="p-0 relative">
                    {imageSrc && (
                      <SafeImage
                        src={imageSrc}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover"
                        data-ai-hint={articleImage?.imageHint}
                      />
                    )}
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {article.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-2 font-medium">
                      {article.source} &middot; {format(new Date(article.publishedDate), 'MMM d, yyyy')}
                    </p>
                    <h2 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 flex-grow">{article.summary}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 mt-auto">
                    <Link href={article.link} className="flex items-center text-primary font-semibold">
                      Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {articles.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">No news posts found. Check back later!</div>
        )}
      </div>
    </section>
  );
}
