'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Newspaper, Settings, LogOut, Megaphone, CalendarCheck, ClipboardList, DollarSign, Globe, HeartHandshake, CreditCard } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<null | {
    appointments: { pending: number; recent: number };
    grants: { recent: number };
    volunteers: { recent: number };
  }>(null);
  const [notifError, setNotifError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!user || !isAdmin) return;
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch notifications (${res.status})`);
        const data = await res.json();
        if (cancelled) return;
        setNotifications(data);
        setNotifError(null);
      } catch (e: any) {
        if (cancelled) return;
        setNotifError(e?.message || 'Failed to fetch notifications');
      }
    };

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user, isAdmin]);

  const badgesByHref = useMemo(() => {
    if (!notifications) return {};
    return {
      '/admin/appointments': notifications.appointments.recent,
      '/admin/grants': notifications.grants.recent,
      '/admin/volunteers': notifications.volunteers.recent,
    } as Record<string, number>;
  }, [notifications]);


  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/programs', label: 'Programs', icon: ClipboardList },
    { href: '/admin/blog', label: 'Blog', icon: Newspaper },
    { href: '/admin/news', label: 'News', icon: Globe },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
    { href: '/admin/volunteers', label: 'Volunteers', icon: HeartHandshake },
    { href: '/admin/grants', label: 'Grants', icon: CreditCard },
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
                        <Link href={item.href} className="flex w-full items-center gap-2">
                          <item.icon />
                          <span className="flex w-full items-center justify-between gap-2">
                            <span>{item.label}</span>
                            {badgesByHref[item.href] ? (
                              <Badge variant="secondary" className="h-5 px-2">
                                {badgesByHref[item.href]}
                              </Badge>
                            ) : null}
                          </span>
                        </Link>
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
            {notifError ? (
              <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                Admin notifications unavailable: {notifError}
              </div>
            ) : null}
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
