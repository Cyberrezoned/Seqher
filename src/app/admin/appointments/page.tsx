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
import { CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { AppointmentRequest } from "@/lib/types";
import AppointmentDetails from "./AppointmentDetails";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = 'force-dynamic';

async function getAppointments(): Promise<AppointmentRequest[]> {
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select('id,name,email,appointment_location,appointment_date,appointment_type,message,status,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load appointments from Supabase:', error);
    return [];
  }
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    appointmentLocation: row.appointment_location || 'Nigeria',
    appointmentDate: row.appointment_date,
    appointmentType: row.appointment_type as AppointmentRequest['appointmentType'],
    message: row.message || '',
    createdAt: row.created_at || new Date().toISOString(),
    status: (row.status as AppointmentRequest['status']) || 'pending',
  }));
}

export default async function AdminAppointmentsPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const appointments = await getAppointments();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <CalendarCheck className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">Appointment Requests</h1>
                <p className="text-muted-foreground">Review and manage incoming appointment requests.</p>
            </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Appointment Requests</CardTitle>
          <CardDescription>A list of all appointment requests submitted through the website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Preferred Date</TableHead>
                <TableHead className="hidden lg:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Submitted At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline">{item.email}</a>
                  </TableCell>
                   <TableCell className="hidden lg:table-cell">
                    {item.appointmentLocation}
                  </TableCell>
                   <TableCell className="hidden lg:table-cell">
                    {format(new Date(item.appointmentDate), 'PP')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell capitalize">
                    {item.appointmentType}
                  </TableCell>
                  <TableCell className="hidden md:table-cell capitalize">
                    {item.status}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.createdAt), 'PPpp')}
                  </TableCell>
                  <TableCell>
                    <AppointmentDetails appointment={item} />
                  </TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 && (
                <TableRow>
                    <TableCell colSpan={8} className="text-center p-8 text-muted-foreground">
                        No appointment requests yet.
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
