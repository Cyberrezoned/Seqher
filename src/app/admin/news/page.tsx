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
import type { NewsArticle } from "@/lib/types";
import DeleteNewsButton from "./DeleteNewsButton";

async function getNewsArticles(): Promise<NewsArticle[]> {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('id,title,summary,source,link,image_id,published_date,category,locale,created_at')
    .order('published_date', { ascending: false });

  if (error || !data) {
    console.error('Failed to load news articles from Supabase:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    source: row.source,
    link: row.link,
    imageId: row.image_id,
    publishedDate: row.published_date,
    category: row.category as NewsArticle['category'],
    locale: (row.locale as NewsArticle['locale']) || 'ng',
  }));
}

export default async function AdminNewsPage() {
  const articles = await getNewsArticles();
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
          <CardTitle>All News Articles</CardTitle>
          <CardDescription>A list of all news articles in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Locale</TableHead>
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Source</TableHead>
                <TableHead className="hidden md:table-cell">Published Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link href={item.link} className="hover:underline" target="_blank">{item.title}</Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell uppercase">
                    <Badge variant="outline">{item.locale}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{item.source}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.publishedDate), 'PP')}
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
               {articles.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">
                            No news articles created yet.
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
