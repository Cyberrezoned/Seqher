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

import { MoreHorizontal, PlusCircle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Program } from "@/lib/types";
import DeleteProgramButton from "./DeleteProgramButton";

async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabaseAdmin
    .from('programs')
    .select('id,title,summary,description,image_id,sdg_goals,locale,created_at')
    .order('title', { ascending: true });

  if (error || !data) {
    console.error('Failed to load programs from Supabase:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    imageId: row.image_id,
    sdgGoals: row.sdg_goals || [],
    locale: (row.locale as Program['locale']) || 'ng',
  }));
}

export default async function AdminProgramsPage() {
  const programs = await getPrograms();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <ClipboardList className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">Programs</h1>
                <p className="text-muted-foreground">Create, edit, and manage all programs.</p>
            </div>
        </div>
        <Button asChild>
          <Link href="/admin/programs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Program
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
          <CardDescription>A list of all programs in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Locale</TableHead>
                <TableHead className="hidden md:table-cell">SDG Goals</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell uppercase">{item.locale}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                        {item.sdgGoals.map(goal => (
                            <Badge key={goal} variant="secondary">SDG {goal}</Badge>
                        ))}
                    </div>
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
                                <Link href={`/admin/programs/${item.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <DeleteProgramButton programId={item.id} programTitle={item.title} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {programs.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={3} className="text-center p-8 text-muted-foreground">
                        No programs created yet.
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
