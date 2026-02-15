'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  BriefcaseBusiness,
  CalendarCheck2,
  ChevronDown,
  FolderKanban,
  HandCoins,
  HeartHandshake,
  Home,
  Info,
  Menu,
  Newspaper,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import Logo from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { Language } from '@/lib/i18n/language';

type Region = 'ng' | 'ca';
type NavItem = {
  label: string;
  href: string;
  isActive: boolean;
  icon: LucideIcon;
};

function readRegionCookie(): Region | null {
  const regionCookie = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith('seqher_region='))
    ?.split('=')[1];

  if (regionCookie === 'ng' || regionCookie === 'ca') return regionCookie;
  return null;
}

export default function Header() {
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, messages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preferredRegion, setPreferredRegion] = useState<Region>('ng');
  const router = useRouter();

  const isLandingPage = pathname === '/';
  const isNigeria = pathname.startsWith('/ng');
  const isCanada = pathname.startsWith('/ca');
  const isCountrySpecificPath = isNigeria || isCanada;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isNigeria) {
      setPreferredRegion('ng');
      return;
    }
    if (isCanada) {
      setPreferredRegion('ca');
      return;
    }

    const cookieRegion = readRegionCookie();
    if (cookieRegion) setPreferredRegion(cookieRegion);
  }, [isNigeria, isCanada, pathname]);

  const currentRegion: Region = isCanada ? 'ca' : isNigeria ? 'ng' : preferredRegion;
  const regionHomeHref = isLandingPage ? '/' : `/${currentRegion}`;
  const regionDonateHref = `/${currentRegion}/donate`;
  const regionSubscribeHref = '/ng/subscribe';

  const setLanguageAndRefresh = (next: Language) => {
    setLanguage(next);
    router.refresh();
    setIsMenuOpen(false);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  }

  const avatarUrl =
    (user?.metadata as any)?.user_metadata?.avatar_url ??
    (user?.metadata as any)?.user_metadata?.picture ??
    null;

  const landingNavItems: NavItem[] = [
    {
      label: messages.home,
      href: '/',
      isActive: pathname === '/',
      icon: Home,
    },
    {
      label: messages.aboutUs,
      href: '/#about-us',
      isActive: false,
      icon: Info,
    },
    {
      label: messages.updates,
      href: '/#updates',
      isActive: false,
      icon: Newspaper,
    },
    {
      label: messages.donate,
      href: regionDonateHref,
      isActive: pathname.startsWith(regionDonateHref),
      icon: HandCoins,
    },
    {
      label: 'Subscribe',
      href: regionSubscribeHref,
      isActive: pathname.startsWith(regionSubscribeHref),
      icon: BellRing,
    },
  ];

  const countryNavItems: NavItem[] = isCanada
    ? [
        { label: messages.home, href: '/', isActive: pathname === '/', icon: Home },
        { label: messages.aboutUs, href: '/ca#purpose', isActive: pathname === '/ca', icon: Info },
        { label: messages.volunteer, href: '/ca/volunteer', isActive: pathname.startsWith('/ca/volunteer'), icon: HeartHandshake },
        {
          label: messages.bookAppointment,
          href: '/ca/appointment',
          isActive: pathname.startsWith('/ca/appointment'),
          icon: CalendarCheck2,
        },
        { label: messages.careers, href: '/ca/careers', isActive: pathname.startsWith('/ca/careers'), icon: BriefcaseBusiness },
        { label: messages.projects, href: '/ca#projects', isActive: pathname === '/ca', icon: FolderKanban },
        { label: messages.donate, href: '/ca/donate', isActive: pathname.startsWith('/ca/donate'), icon: HandCoins },
      ]
    : [
        { label: messages.home, href: '/', isActive: pathname === '/', icon: Home },
        { label: messages.aboutUs, href: '/ng/about', isActive: pathname.startsWith('/ng/about'), icon: Info },
        { label: messages.volunteer, href: '/ng/volunteer', isActive: pathname.startsWith('/ng/volunteer'), icon: HeartHandshake },
        {
          label: messages.bookAppointment,
          href: '/ng/appointment?location=Nigeria',
          isActive: pathname.startsWith('/ng/appointment'),
          icon: CalendarCheck2,
        },
        { label: messages.careers, href: '/ng/careers', isActive: pathname.startsWith('/ng/careers'), icon: BriefcaseBusiness },
        { label: messages.projects, href: '/ng/projects', isActive: pathname.startsWith('/ng/projects'), icon: FolderKanban },
        { label: messages.donate, href: '/ng/donate', isActive: pathname.startsWith('/ng/donate'), icon: HandCoins },
        { label: 'Subscribe', href: '/ng/subscribe', isActive: pathname.startsWith('/ng/subscribe'), icon: BellRing },
      ];

  const navItems = isLandingPage ? landingNavItems : isCountrySpecificPath ? countryNavItems : landingNavItems;

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
           <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl || ''} alt={user?.displayName || 'User'} />
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || 'Welcome'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && <DropdownMenuItem asChild><Link href="/admin">Admin Dashboard</Link></DropdownMenuItem>}
        <DropdownMenuItem onClick={signOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 transition-colors duration-300"
    )}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={regionHomeHref} className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <span className="relative inline-flex h-10 w-10 items-center justify-center">
            <span className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.22),transparent_65%)] blur-sm" />
            <Logo className="relative h-7 w-7 text-primary drop-shadow-[0_8px_18px_hsl(var(--primary)/0.25)]" />
          </span>
          <span className="font-bold text-xl font-headline tracking-tight">SEQHER</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-3">
          {navItems.map((item) => {
            const ItemIcon = item.icon;

            return (
              <motion.div key={`${item.label}-${item.href}`} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={item.href}
                  className={cn(
                    'group relative inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors',
                    item.isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <ItemIcon
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      item.isActive ? 'text-primary' : 'group-hover:scale-110 group-hover:text-primary'
                    )}
                  />
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      'pointer-events-none absolute -bottom-1 left-2 right-2 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300',
                      item.isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        {language.toUpperCase()} <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl p-2">
                      <DropdownMenuLabel className="px-2">{messages.language}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => setLanguageAndRefresh('en')}>{messages.english}</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setLanguageAndRefresh('fr')}>{messages.french}</DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
                {user && <UserMenu />}
            </div>

            <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary/70 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>
      </nav>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute left-0 top-16 w-full bg-background py-4 shadow-lg md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="container mx-auto flex flex-col gap-4 px-4">
              {navItems.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={`mobile-${item.label}-${item.href}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.18 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'group inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                        item.isActive
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ItemIcon
                        className={cn(
                          'h-4 w-4 transition-transform duration-300',
                          item.isActive ? 'text-primary' : 'group-hover:scale-110 group-hover:text-primary'
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">{messages.language}</div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant={language === 'en' ? 'secondary' : 'ghost'} onClick={() => setLanguageAndRefresh('en')}>
                    {messages.english}
                  </Button>
                  <Button type="button" size="sm" variant={language === 'fr' ? 'secondary' : 'ghost'} onClick={() => setLanguageAndRefresh('fr')}>
                    {messages.french}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-t pt-4">
                {user && (
                  <>
                    {isAdmin && (
                      <Button asChild variant="secondary">
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          Admin
                        </Link>
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
