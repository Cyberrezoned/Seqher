
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Newspaper, CalendarPlus, Heart, LayoutGrid, Globe, Info, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';

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
import { useScrollPosition } from '@/hooks/use-scroll-position';


const navLinks = [
  { href: '/ng/about', label: 'About Us', icon: <Info className="h-4 w-4" /> },
  { href: '/ng/people', label: 'People', icon: <Users className="h-4 w-4" /> },
  { href: '/ng/programs', label: 'Programs', icon: <LayoutGrid className="h-4 w-4" /> },
  { href: '/ng/blog', label: 'Blog', icon: <Newspaper className="h-4 w-4" /> },
  { href: '/ng/news', label: 'News', icon: <Globe className="h-4 w-4" /> },
  { href: '/ng/careers', label: 'Careers', icon: <Briefcase className="h-4 w-4" /> },
  { href: '/ng/appointment', label: 'Book Appointment', icon: <CalendarPlus className="h-4 w-4" /> },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollY = useScrollPosition();

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
      "sticky top-0 z-50 w-full border-b transition-colors duration-300",
      scrollY > 50 
        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border" 
        : "bg-transparent border-transparent"
    )}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <span className="relative inline-flex h-10 w-10 items-center justify-center">
            <span className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.22),transparent_65%)] blur-sm" />
            <Logo className="relative h-7 w-7 text-primary drop-shadow-[0_8px_18px_hsl(var(--primary)/0.25)]" />
          </span>
          <span className="font-bold text-xl font-headline tracking-tight">SEQHER</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.href} asChild variant="ghost" className={cn(pathname.startsWith(link.href) ? 'text-primary' : 'text-muted-foreground')}>
                <Link
                href={link.href}
                className='flex items-center gap-2'
                >
                {link.icon}
                {link.label}
                </Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
                 <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/ng/donate">
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
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        'flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary',
                        pathname === link.href ? 'text-primary' : 'text-foreground'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                    >
                    {link.icon}
                    {link.label}
                    </Link>
                ))}
                <div className="border-t pt-4 flex flex-col gap-4">
                    <Button asChild>
                        <Link href="/ng/donate" onClick={() => setIsMenuOpen(false)}>
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
