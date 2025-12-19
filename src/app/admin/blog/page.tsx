import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { MoreHorizontal, PlusCircle, Newspaper } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BlogPost } from "@/lib/types";
import DeletePostButton from "./DeletePostButton";

export const dynamic = 'force-dynamic';

async function getBlogPosts(): Promise<BlogPost[]> {
  const fetchFrom = async (table: string) =>
    supabaseAdmin
      .from(table)
      .select('id,title,content,slug,image_id,author,author_id,locale,created_at')
      .order('created_at', { ascending: false });

  // Support both legacy `blogposts` and newer `blog_posts` table names.
  let { data, error } = await fetchFrom('blog_posts');
  if (error) {
    const fallback = await fetchFrom('blogposts');
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error('Failed to load blog posts from Supabase:', error);
    return [];
  }
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content || '',
    slug: row.slug,
    imageId: row.image_id || 'blog-community-gardens',
    author: row.author || 'Unknown',
    authorId: row.author_id || '',
    createdAt: row.created_at || new Date().toISOString(),
    locale: (row.locale as BlogPost['locale']) || 'ng',
  }));
}

export default async function AdminBlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Newspaper className="h-8 w-8 text-primary"/>
            <div>
                <h1 className="text-3xl font-bold font-headline">Blog Management</h1>
                <p className="text-muted-foreground">Create, edit, and manage all blog posts.</p>
            </div>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>A list of all blog posts in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Locale</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <Link href={`/ng/blog/${post.slug}`} className="hover:underline" target="_blank">
                      {post.title}
                    </Link>

                  </TableCell>
                  <TableCell className="hidden md:table-cell uppercase">
                    <Badge variant="outline">{post.locale}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(post.createdAt), 'PPpp')}
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
                                <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <DeletePostButton postId={post.id} postTitle={post.title} />
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
