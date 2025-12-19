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
import { Badge } from "@/components/ui/badge";

import { MoreHorizontal, PlusCircle, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { AdminNewsPost } from "./types";
import DeleteNewsButton from "./DeleteNewsButton";

export const dynamic = 'force-dynamic';

async function getNewsPosts(): Promise<AdminNewsPost[]> {
  const primary = await supabaseAdmin
    .from('news')
    .select('id,title,summary,source,link,image_id,published_date,category,locale,created_at,updated_at')
    .order('published_date', { ascending: false });

  const fallback = primary.error
    ? await supabaseAdmin
        .from('news')
        .select('id,title,summary,slug,imageid,locale,created_at,updated_at')
        .order('created_at', { ascending: false })
    : null;

  const data = fallback ? fallback.data : primary.data;
  const error = fallback ? fallback.error : primary.error;

  if (error) {
    console.error('Failed to load news articles from Supabase:', error);
    return [];
  }
  if (!data) return [];

  const rows = data as any[];
  return rows.map((row) => {
    const derivedSlug =
      row.slug ??
      (typeof row.link === 'string' ? row.link.split('/').filter(Boolean).pop() : '') ??
      '';
    return {
      id: row.id,
      title: row.title ?? '',
      slug: derivedSlug,
      summary: row.summary ?? '',
      content: '',
      imageId: row.image_id ?? row.imageid ?? null,
      locale: (row.locale as AdminNewsPost['locale']) || 'ng',
      createdAt: row.created_at ?? new Date().toISOString(),
      updatedAt: row.updated_at ?? null,
    };
  });
}

export default async function AdminNewsPage() {
  const posts = await getNewsPosts();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Globe className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">News Management</h1>
                <p className="text-muted-foreground">Create, edit, and manage news articles.</p>
            </div>
        </div>
        <Button asChild>
          <Link href="/admin/news/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create News Article
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All News Posts</CardTitle>
          <CardDescription>A list of all news posts in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Locale</TableHead>
                <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/news/${item.id}/edit`} className="hover:underline">
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell uppercase">
                    <Badge variant="outline">{item.locale}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.updatedAt ?? item.createdAt), 'PP')}
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
                                <Link href={`/admin/news/${item.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <DeleteNewsButton articleId={item.id} articleTitle={item.title} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {posts.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center p-8 text-muted-foreground">
                            No news posts created yet.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
