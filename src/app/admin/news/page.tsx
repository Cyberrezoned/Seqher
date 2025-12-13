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

import { MoreHorizontal, PlusCircle, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { NewsArticle } from "@/lib/types";
import DeleteNewsButton from "./DeleteNewsButton";

async function getNewsArticles(): Promise<NewsArticle[]> {
  const articlesQuery = query(collection(db, 'news'), orderBy('publishedDate', 'desc'));
  const snapshot = await getDocs(articlesQuery);
  const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          publishedDate: data.publishedDate?.toDate ? data.publishedDate.toDate().toISOString() : new Date().toISOString(),
      } as NewsArticle
  });
  return list;
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
                  <TableCell className="hidden md:table-cell">{item.source}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.publishedDate), 'PPpp')}
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
            </TableBody>
          </Table>
          {articles.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No news articles created yet.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
