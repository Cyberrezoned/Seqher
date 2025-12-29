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
import { HeartHandshake } from "lucide-react";
import { format } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { VolunteerApplication } from "@/lib/types";
import VolunteerDetails from "./VolunteerDetails";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

async function getVolunteerApplications(): Promise<VolunteerApplication[]> {
  const base = "id,name,email,phone,preferred_location,interests,message,locale,created_at";
  const withMgmt = `${base},status,admin_notes`;

  let { data, error } = await supabaseAdmin
    .from("volunteer_applications")
    .select(withMgmt)
    .order("created_at", { ascending: false });

  if (error) {
    ({ data, error } = await supabaseAdmin
      .from("volunteer_applications")
      .select(base)
      .order("created_at", { ascending: false }));
  }

  if (error) {
    console.error("Failed to load volunteer applications from Supabase:", error);
    return [];
  }
  if (!data) return [];

  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    preferredLocation: row.preferred_location || "—",
    interests: Array.isArray(row.interests) ? row.interests : [],
    message: row.message ?? null,
    locale: (row.locale as VolunteerApplication["locale"]) || "ng",
    createdAt: row.created_at || new Date().toISOString(),
    status: (row.status as VolunteerApplication["status"]) ?? null,
    adminNotes: row.admin_notes ?? null,
  }));
}

export default async function AdminVolunteersPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const applications = await getVolunteerApplications();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HeartHandshake className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold font-headline">Volunteer Applications</h1>
            <p className="text-muted-foreground">Review and manage volunteer pathway submissions.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Volunteer Applications</CardTitle>
          <CardDescription>A list of all volunteer submissions received through the website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Preferred Location</TableHead>
                <TableHead className="hidden lg:table-cell">Locale</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Submitted At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                      {item.email}
                    </a>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{item.preferredLocation}</TableCell>
                  <TableCell className="hidden lg:table-cell uppercase">{item.locale}</TableCell>
                  <TableCell className="hidden md:table-cell capitalize">{item.status || "new"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.createdAt), "PPpp")}
                  </TableCell>
                  <TableCell>
                    <VolunteerDetails application={item} />
                  </TableCell>
                </TableRow>
              ))}
              {applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center p-8 text-muted-foreground">
                    No volunteer applications yet.
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

