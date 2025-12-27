import Image from 'next/image';
import Link from 'next/link';
import { Handshake, Users } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

type TeamPhoto = {
  src: string;
  alt: string;
};

type Partner = {
  name: string;
  subtitle: string;
  href?: string;
  logoSrc: string;
  logoAlt: string;
};

const teamPhotos: TeamPhoto[] = [
  { src: '/images/team/team-01.jpeg', alt: 'SEQHER team gathering photo' },
  { src: '/images/team/team-02.jpeg', alt: 'SEQHER team gathering photo (alternate)' },
];

const execLeadershipPhoto: TeamPhoto = {
  src: '/images/team/exec-leadership-01.jpeg',
  alt: 'Operations and executive leadership team photo',
};

const partners: Partner[] = [
  {
    name: 'GATE',
    subtitle: 'Global Action for Trans Equality',
    href: 'https://gate.ngo/',
    logoSrc: '/images/partners/gate.jpeg',
    logoAlt: 'GATE — Global Action for Trans Equality',
  },
  {
    name: 'ISDAO',
    subtitle: 'Initiative Sankofa d’Afrique de l’Ouest',
    href: 'https://isdao.org/',
    logoSrc: '/images/partners/isdao.jpeg',
    logoAlt: 'ISDAO — Initiative Sankofa d’Afrique de l’Ouest',
  },
  {
    name: 'Rainbow Railroad',
    subtitle: 'Emergency support and safe pathways',
    href: 'https://www.rainbowrailroad.org/',
    logoSrc: '/images/partners/rainbow-railroad.jpeg',
    logoAlt: 'Rainbow Railroad',
  },
  {
    name: 'Kaleidoscope International Trust',
    subtitle: 'Strengthening leadership and governance',
    href: 'https://www.kaleidoscopetrust.com/',
    logoSrc: '/images/partners/kaleidoscope.jpeg',
    logoAlt: 'Kaleidoscope International Trust',
  },
  {
    name: 'Government of Ireland',
    subtitle: 'International Development Programme',
    href: 'https://www.gov.ie/en/organisation/department-of-foreign-affairs/',
    logoSrc: '/images/partners/ireland.jpeg',
    logoAlt: 'Government of Ireland — International Development Programme',
  },
];

export const dynamic = 'force-static';

export default function PeoplePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="mx-auto max-w-3xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 shadow-sm backdrop-blur">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold tracking-wide text-foreground/90 sm:text-sm">People</span>
        </div>
        <h1 className="mt-6 font-headline text-3xl font-extrabold tracking-tight md:text-5xl">People & Partners</h1>
        <p className="mt-3 text-muted-foreground">
          We collaborate with partners and supporters to strengthen communities, improve visibility, and advance equal health and rights.
        </p>
      </header>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-headline text-2xl font-bold">The Team Behind SEQHER</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Moments from our staff and volunteer teams working together across communities.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {teamPhotos.map((photo) => (
            <div
              key={photo.src}
              className="group relative overflow-hidden rounded-xl border bg-muted/20 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-60" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-headline text-2xl font-bold">Operations & Executive Leadership</h2>
            <p className="mt-1 text-sm text-muted-foreground">The team responsible for operations and executive leadership.</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="group relative overflow-hidden rounded-xl border bg-muted/20 shadow-sm transition-shadow hover:shadow-lg">
            <div className="relative aspect-video">
              <Image
                src={execLeadershipPhoto.src}
                alt={execLeadershipPhoto.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-60" />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-headline text-2xl font-bold">Our Partners</h2>
            <p className="mt-1 text-sm text-muted-foreground">Organizations supporting SEQHER programs and community work.</p>
          </div>
          <Link
            href="/ng/donate"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
          >
            <Handshake className="h-4 w-4" />
            Partner with us
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map(({ name, subtitle, href, logoSrc, logoAlt }) => {
            const card = (
              <Card className="group h-full overflow-hidden border bg-background/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="rounded-xl border bg-white p-4">
                    <div className="relative h-16 w-full">
                      <Image src={logoSrc} alt={logoAlt} fill className="object-contain" sizes="(max-width: 768px) 90vw, 33vw" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-semibold leading-tight group-hover:text-primary transition-colors">{name}</p>
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                </CardContent>
              </Card>
            );

            return href ? (
              <a key={name} href={href} target="_blank" rel="noreferrer" className="block">
                {card}
              </a>
            ) : (
              <div key={name}>{card}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
