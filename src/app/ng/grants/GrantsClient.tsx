'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Lock } from 'lucide-react';

import type { GrantOpportunity } from '@/content/grants';
import RichText from '@/components/content/RichText';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import GrantsSubscribeForm, { hasLocalGrantsAccess } from '@/app/ng/grants/GrantsSubscribeForm';

export default function GrantsClient({ grants }: { grants: GrantOpportunity[] }) {
  const [hasAccess, setHasAccess] = useState(() => hasLocalGrantsAccess());

  useEffect(() => {
    setHasAccess(hasLocalGrantsAccess());
  }, []);

  const sorted = useMemo(() => grants.slice(), [grants]);

  return (
    <div className="space-y-8">
      <Card className="border bg-background/70">
        <CardHeader className="pb-2">
          <p className="text-sm font-semibold text-primary">Upcoming grants</p>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          We post funding opportunities here as they become available. Full eligibility and application details are available to subscribers.
        </CardContent>
      </Card>

      <div className="max-w-3xl">
        <GrantsSubscribeForm onSubscribed={() => setHasAccess(true)} />
      </div>

      {sorted.length === 0 ? (
        <div className="text-center p-10 text-muted-foreground">No grants posted yet. Please check back soon.</div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {sorted.map((grant) => (
            <AccordionItem key={grant.slug} value={grant.slug} className="rounded-xl border bg-background/70 px-4 shadow-sm">
              <AccordionTrigger className="py-5 hover:no-underline">
                <div className="flex w-full flex-col items-start gap-2 text-left md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="font-headline text-lg font-bold leading-tight">{grant.title}</p>
                    <p className="text-sm text-muted-foreground">{grant.summary}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {grant.deadlineLabel}
                    </Badge>
                    {!hasAccess ? (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3.5 w-3.5" />
                        Subscriber details
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                {hasAccess ? (
                  <RichText
                    content={grant.contentHtml}
                    className="prose prose-base max-w-none text-foreground prose-p:text-foreground prose-headings:text-primary prose-strong:text-foreground prose-a:text-primary prose-img:rounded-lg prose-img:shadow-sm"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                      Subscribe above to unlock full grant details, eligibility criteria, and application links.
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
