import Link from 'next/link';
import { Stethoscope, ClipboardList, Users, ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const contentBlocks = [
  {
    title: 'Service Overview',
    icon: <Stethoscope className="h-5 w-5 text-primary" />,
    placeholder:
      'Organization content pending: describe core health services, delivery model, and expected outcomes in Canada.',
  },
  {
    title: 'Eligibility and Access',
    icon: <Users className="h-5 w-5 text-primary" />,
    placeholder:
      'Organization content pending: define who can access the services, access criteria, referral pathway, and intake process.',
  },
  {
    title: 'Program Schedule and Locations',
    icon: <ClipboardList className="h-5 w-5 text-primary" />,
    placeholder:
      'Organization content pending: provide operating schedule, service locations, and contact workflow for appointments.',
  },
];

export default function CanadaHealthServicesPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-4 w-4" />
            Canada
          </p>
          <h1 className="mt-2 font-headline text-3xl font-bold md:text-5xl">Health Services</h1>
          <p className="mt-4 text-muted-foreground">
            This dedicated page is live and ready for organization-provided content.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-xl border bg-secondary/30 p-5 text-sm text-muted-foreground">
          Content status: awaiting final text from the organization for full publication.
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-3">
          {contentBlocks.map((block) => (
            <Card key={block.title} className="group h-full border bg-background/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center gap-3">
                <span className="rounded-md bg-primary/10 p-2 transition-transform duration-300 group-hover:scale-110">{block.icon}</span>
                <CardTitle className="font-headline text-lg">{block.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{block.placeholder}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap gap-3">
          <Button asChild>
            <Link href="/ca">
              Back to Canada Home <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/ca/appointment">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
