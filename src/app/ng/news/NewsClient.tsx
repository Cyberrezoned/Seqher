'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SafeImage from '@/components/ui/safe-image';
import NewsSubscribeForm from '@/app/ng/news/NewsSubscribeForm';
import { Button } from '@/components/ui/button';

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

export type UpdateItem = {
  id: string;
  type: 'news' | 'story';
  title: string;
  summary: string;
  date: string; // ISO
  badge: string;
  href: string;
  imageId?: string;
  imageUrl?: string | null;
  sourceLabel: string;
  readingMinutes?: number;
};

type Filter = 'all' | 'news' | 'story';

export default function NewsClient({ items, locale = 'ng' }: { items: UpdateItem[]; locale?: 'ng' | 'ca' | 'global' }) {
  const hasStories = useMemo(() => items.some((item) => item.type === 'story'), [items]);
  const [filter, setFilter] = useState<Filter>(hasStories ? 'all' : 'news');

  const visibleItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.type === filter);
  }, [filter, items]);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {hasStories ? (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="font-headline text-2xl font-bold md:text-3xl">What’s the difference?</h2>
            <p className="mt-2 text-muted-foreground">
              <span className="font-semibold text-foreground">News</span> covers official updates, events, statements, and opportunities.{' '}
              <span className="font-semibold text-foreground">Stories</span> are longer community reflections, learnings, and highlights.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
              >
                All
              </Button>
              <Button
                type="button"
                variant={filter === 'news' ? 'default' : 'outline'}
                onClick={() => setFilter('news')}
                className={filter === 'news' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
              >
                News
              </Button>
              <Button
                type="button"
                variant={filter === 'story' ? 'default' : 'outline'}
                onClick={() => setFilter('story')}
                className={filter === 'story' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
              >
                Stories
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleItems.map((item, index) => {
            const fallbackImage = item.imageId ? PlaceHolderImages.find((p) => p.id === item.imageId) : undefined;
            const imageSrc = item.imageUrl || fallbackImage?.imageUrl;
            const isExternal = /^https?:\/\//.test(item.href);
            return (
              <motion.div
                key={item.id}
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
                        alt={item.title}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover"
                        data-ai-hint={fallbackImage?.imageHint}
                      />
                    )}
                    <div className="absolute right-2 top-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{item.badge}</Badge>
                      <Badge variant="outline" className="bg-background/70">
                        {item.type === 'news' ? 'News' : 'Story'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-2 font-medium">
                      {item.sourceLabel} &middot; {format(new Date(item.date), 'MMM d, yyyy')}
                      {item.type === 'story' && item.readingMinutes ? ` \u00b7 ${item.readingMinutes} min read` : ''}
                    </p>
                    <h2 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 flex-grow">{item.summary}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 mt-auto">
                    {isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-primary font-semibold"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    ) : (
                      <Link href={item.href} className="flex items-center text-primary font-semibold">
                        Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {visibleItems.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">No updates found. Check back later!</div>
        )}

        <div className="mt-12 max-w-3xl mx-auto">
          <NewsSubscribeForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
