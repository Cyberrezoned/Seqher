import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, DollarSign, CalendarCheck, HeartHandshake, CreditCard } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

type DashboardItem = {
    id: string;
    title: string;
    subtitle: string;
    href: string;
};

async function getCounts() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [pendingAppointments, recentVolunteers, recentGrants] = await Promise.all([
        supabaseAdmin.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabaseAdmin.from('volunteer_applications').select('id', { count: 'exact', head: true }).gte('created_at', since),
        supabaseAdmin.from('grant_subscriptions').select('id', { count: 'exact', head: true }).gte('created_at', since),
    ]);

    return {
        pendingAppointments: pendingAppointments.count ?? 0,
        recentVolunteers: recentVolunteers.count ?? 0,
        recentGrants: recentGrants.count ?? 0,
    };
}

async function getRecent(): Promise<{
    appointments: DashboardItem[];
    volunteers: DashboardItem[];
    grants: DashboardItem[];
}> {
    const [appointments, volunteers, grants] = await Promise.all([
        supabaseAdmin
            .from('appointments')
            .select('id,name,email,status,created_at')
            .order('created_at', { ascending: false })
            .limit(5),
        supabaseAdmin
            .from('volunteer_applications')
            .select('id,name,email,preferred_location,created_at')
            .order('created_at', { ascending: false })
            .limit(5),
        supabaseAdmin
            .from('grant_subscriptions')
            .select('id,name,email,plan,created_at')
            .order('created_at', { ascending: false })
            .limit(5),
    ]);

    const a = (appointments.data ?? []) as any[];
    const v = (volunteers.data ?? []) as any[];
    const g = (grants.data ?? []) as any[];

    return {
        appointments: a.map((row) => ({
            id: row.id,
            title: row.name,
            subtitle: `${row.status || 'pending'} • ${formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}`,
            href: '/admin/appointments',
        })),
        volunteers: v.map((row) => ({
            id: row.id,
            title: row.name,
            subtitle: `${row.preferred_location || '—'} • ${formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}`,
            href: '/admin/volunteers',
        })),
        grants: g.map((row) => ({
            id: row.id,
            title: row.name,
            subtitle: `${row.plan || 'monthly'} • ${formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}`,
            href: '/admin/grants',
        })),
    };
}

export default async function AdminDashboardPage() {
    const admin = await requireAdmin();
    if (!admin) return null;

    const [counts, recent] = await Promise.all([getCounts(), getRecent()]);

    const stats = [
        {title: "Pending Appointments", value: String(counts.pendingAppointments), icon: <CalendarCheck className="h-6 w-6 text-muted-foreground" />},
        {title: "New Volunteers (24h)", value: String(counts.recentVolunteers), icon: <HeartHandshake className="h-6 w-6 text-muted-foreground" />},
        {title: "New Grants (24h)", value: String(counts.recentGrants), icon: <CreditCard className="h-6 w-6 text-muted-foreground" />},
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Quickly jump to common tasks.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     <Link href="/admin/blog/new" className="block p-4 border rounded-lg hover:bg-secondary">
                        <h3 className="font-semibold">Create New Blog Post</h3>
                        <p className="text-sm text-muted-foreground">Write and publish a new article.</p>
                    </Link>
                     <Link href="/admin/programs/new" className="block p-4 border rounded-lg hover:bg-secondary">
                        <h3 className="font-semibold">Create New Program</h3>
                        <p className="text-sm text-muted-foreground">Add a new program to your initiatives.</p>
                    </Link>
                     <Link href="/admin/appointments" className="block p-4 border rounded-lg hover:bg-secondary">
                        <h3 className="font-semibold flex items-center gap-2">Review Appointments <CalendarCheck className="h-4 w-4"/></h3>
                        <p className="text-sm text-muted-foreground">View and manage appointment requests.</p>
                    </Link>
                     <Link href="/admin/volunteers" className="block p-4 border rounded-lg hover:bg-secondary">
                        <h3 className="font-semibold flex items-center gap-2">Review Volunteers <HeartHandshake className="h-4 w-4"/></h3>
                        <p className="text-sm text-muted-foreground">View and manage volunteer applications.</p>
                    </Link>
                     <Link href="/admin/grants" className="block p-4 border rounded-lg hover:bg-secondary">
                        <h3 className="font-semibold flex items-center gap-2">Review Grants <CreditCard className="h-4 w-4"/></h3>
                        <p className="text-sm text-muted-foreground">View grant access subscriptions.</p>
                    </Link>
                     <Link href="/admin/donations" className="block p-4 border rounded-lg hover:bg-secondary">
                        <h3 className="font-semibold flex items-center gap-2">View Donations <DollarSign className="h-4 w-4"/></h3>
                        <p className="text-sm text-muted-foreground">See recent donation records.</p>
                    </Link>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Appointments</CardTitle>
                        <CardDescription>Latest appointment requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {recent.appointments.length ? recent.appointments.map((item) => (
                            <Link key={item.id} href={item.href} className="block rounded-md border p-3 hover:bg-secondary">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                            </Link>
                        )) : (
                            <div className="text-sm text-muted-foreground">No appointments yet.</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Volunteers</CardTitle>
                        <CardDescription>Latest volunteer applications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {recent.volunteers.length ? recent.volunteers.map((item) => (
                            <Link key={item.id} href={item.href} className="block rounded-md border p-3 hover:bg-secondary">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                            </Link>
                        )) : (
                            <div className="text-sm text-muted-foreground">No volunteer applications yet.</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Grants</CardTitle>
                        <CardDescription>Latest grant access subscriptions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {recent.grants.length ? recent.grants.map((item) => (
                            <Link key={item.id} href={item.href} className="block rounded-md border p-3 hover:bg-secondary">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                            </Link>
                        )) : (
                            <div className="text-sm text-muted-foreground">No grant requests yet.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
