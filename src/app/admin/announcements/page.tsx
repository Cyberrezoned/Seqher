import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreHorizontal, PlusCircle, Megaphone } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Announcement } from "@/lib/types";
import DeleteAnnouncementButton from "./DeleteAnnouncementButton";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = 'force-dynamic';

async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('id,title,content,locale,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load announcements from Supabase:', error);
    return [];
  }
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    locale: (row.locale as Announcement['locale']) || 'ng',
    createdAt: row.created_at || new Date().toISOString(),
  }));
}

export default async function AdminAnnouncementsPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const announcements = await getAnnouncements();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Megaphone className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">Announcements</h1>
                <p className="text-muted-foreground">Create, edit, and manage site-wide announcements.</p>
            </div>
        </div>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Announcement
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>A list of all announcements in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Locale</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell uppercase">
                    <Badge variant="outline">{item.locale}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.createdAt), 'PPpp')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/announcements/${item.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <DeleteAnnouncementButton announcementId={item.id} announcementTitle={item.title} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
