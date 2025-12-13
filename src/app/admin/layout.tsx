'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Newspaper, Settings, LogOut, Megaphone, CalendarCheck, ClipboardList, DollarSign } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar';
import Logo from '@/components/icons/Logo';
import { usePathname } from 'next/navigation';
import LoginForm from './LoginForm';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Don't redirect, show login form
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    )
  }
  
  if (!isAdmin) {
    return (
         <div className="flex h-screen items-center justify-center text-center">
            <div>
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
                <Button onClick={signOut} className="mt-4">Logout</Button>
            </div>
        </div>
    )
  }


  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/programs', label: 'Programs', icon: ClipboardList },
    { href: '/admin/blog', label: 'Blog', icon: Newspaper },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
    { href: '/admin/donations', label: 'Donations', icon: DollarSign },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 p-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg font-headline tracking-tight group-data-[collapsible=icon]:hidden">SEQHER Admin</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map(item => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href) && (pathname === item.href || pathname.startsWith(item.href + '/'))} tooltip={{children: item.label}}>
                        <Link href={item.href}><item.icon /> <span>{item.label}</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} tooltip={{children: "Logout"}}>
                    <LogOut /> <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
