
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


export default function Header() {
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const isCanada = pathname.startsWith('/ca');
  const regionHomeHref = isCanada ? '/ca' : '/ng';

  const setRegionAndGo = (region: 'ng' | 'ca', path?: string) => {
    document.cookie = `seqher_region=${region}; path=/; max-age=31536000; samesite=lax`;
    router.push(path || `/${region}`);
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
        
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={regionHomeHref}
            className={cn(
              "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
              pathname === regionHomeHref ? "text-foreground" : null
            )}
          >
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Our Projects <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl p-2">
              <DropdownMenuLabel className="px-2">Choose a country</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setRegionAndGo('ng', '/ng/projects')}>Nigeria</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setRegionAndGo('ca', '/ca#projects')}>Canada</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={isCanada ? "/ca#purpose" : "/ng/about"}
            className={cn(
              "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
              isCanada ? (pathname === "/ca" ? "text-foreground" : null) : pathname.startsWith("/ng/about") ? "text-foreground" : null
            )}
          >
            About Us
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Get Involved <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 rounded-xl p-2">
              <DropdownMenuItem asChild>
                <Link href={isCanada ? "/ca/volunteer" : "/ng/volunteer"} onClick={() => setIsMenuOpen(false)}>
                  Volunteer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={isCanada ? "/ca/appointment" : "/ng/appointment?location=Nigeria"} onClick={() => setIsMenuOpen(false)}>
                  Book Appointment
                </Link>
              </DropdownMenuItem>
              {!isCanada ? (
                <DropdownMenuItem asChild>
                  <Link href="/ng/grants" onClick={() => setIsMenuOpen(false)}>
                    Grants
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem asChild>
                <Link href={isCanada ? "/ca/careers" : "/ng/careers"} onClick={() => setIsMenuOpen(false)}>
                  Careers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={isCanada ? "/ca/donate" : "/ng/donate"} onClick={() => setIsMenuOpen(false)}>
                  Donate
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={isCanada ? "/ca/news" : "/ng/news"}
            className={cn(
              "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
              pathname.startsWith(isCanada ? "/ca/news" : "/ng/news") ? "text-foreground" : null
            )}
          >
            Updates
          </Link>
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
                 <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={isCanada ? "/ca/donate" : "/ng/donate"}>
                        <Heart className="mr-2 h-4 w-4" />
                        Donate
                    </Link>
                </Button>
                {user && <UserMenu />}
            </div>

            <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>
      </nav>
      
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background shadow-lg py-4">
            <div className="container mx-auto px-4 flex flex-col gap-4">
                <Link href={regionHomeHref} className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Our Projects</div>
                  <button type="button" className="block w-full text-left text-base" onClick={() => setRegionAndGo('ng', '/ng/projects')}>
                    Nigeria
                  </button>
                  <button type="button" className="block w-full text-left text-base" onClick={() => setRegionAndGo('ca', '/ca#projects')}>
                    Canada
                  </button>
                </div>
                <Link href={isCanada ? "/ca#purpose" : "/ng/about"} className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </Link>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Get Involved</div>
                  <Link href={isCanada ? "/ca/volunteer" : "/ng/volunteer"} className="block text-base" onClick={() => setIsMenuOpen(false)}>
                    Volunteer
                  </Link>
                  <Link href={isCanada ? "/ca/appointment" : "/ng/appointment?location=Nigeria"} className="block text-base" onClick={() => setIsMenuOpen(false)}>
                    Book Appointment
                  </Link>
                  {!isCanada ? (
                    <Link href="/ng/grants" className="block text-base" onClick={() => setIsMenuOpen(false)}>
                      Grants
                    </Link>
                  ) : null}
                  <Link href={isCanada ? "/ca/careers" : "/ng/careers"} className="block text-base" onClick={() => setIsMenuOpen(false)}>
                    Careers
                  </Link>
                </div>
                <Link href={isCanada ? "/ca/news" : "/ng/news"} className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Updates
                </Link>
                <div className="border-t pt-4 flex flex-col gap-4">
                    <Button asChild>
                        <Link href={isCanada ? "/ca/donate" : "/ng/donate"} onClick={() => setIsMenuOpen(false)}>
                            <Heart className="mr-2 h-4 w-4" />
                            Donate
                        </Link>
                    </Button>
                     {user && (
                         <>
                            {isAdmin && 
                                <Button asChild variant="secondary">
                                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                                </Button>
                            }
                            <Button onClick={() => { signOut(); setIsMenuOpen(false); }}>Logout</Button>
                         </>
                     )}
                </div>
            </div>
        </div>
      )}
    </header>
  );
}
