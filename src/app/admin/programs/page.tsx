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
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Program } from "@/lib/types";
import DeleteProgramButton from "./DeleteProgramButton";

async function getPrograms(): Promise<Program[]> {
  const programsQuery = query(collection(db, 'programs'), orderBy('title', 'asc'));
  const snapshot = await getDocs(programsQuery);
  const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
      } as Program
  });
  return list;
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
            </TableBody>
          </Table>
            {programs.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No programs created yet.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
