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

function isColumnSchemaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const record = error as Record<string, unknown>;
  const code = record.code;
  const message = String(record.message || '');
  return code === 'PGRST204' || code === '42703' || message.includes('Could not find') || message.includes('column');
}

function getFirstString(row: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return fallback;
}

async function getAppointments(): Promise<AppointmentRequest[]> {
  const selectVariants: string[] = [
    'id,name,email,appointment_location,appointment_date,appointment_type,appointmentdate,appointmenttype,message,status,created_at',
    'id,name,email,appointment_location,appointment_date,appointment_type,message,status,created_at',
    'id,name,email,appointment_location,appointmentdate,appointmenttype,message,status,created_at',
    'id,name,email,appointmentLocation,appointmentDate,appointmentType,message,status,created_at',
    'id,name,email,location,date,type,message,status,created_at',
    'id,name,email,location,preferred_date,type,message,status,created_at',
  ];

  let data: Record<string, unknown>[] | null = null;
  let lastError: unknown = null;

  for (const selectColumns of selectVariants) {
    const result = await supabaseAdmin.from('appointments').select(selectColumns).order('created_at', { ascending: false });
    if (!result.error) {
      data = (result.data as unknown as Record<string, unknown>[] | null) ?? [];
      lastError = null;
      break;
    }

    lastError = result.error;
    if (!isColumnSchemaError(result.error)) break;
  }

  if (lastError) {
    console.error('Failed to load appointments from Supabase:', lastError);
    return [];
  }
  if (!data) return [];

  return data.map((row) => {
    const createdAt = getFirstString(row, ['created_at'], new Date().toISOString());
    const appointmentDate = getFirstString(
      row,
      ['appointment_date', 'appointmentdate', 'appointmentDate', 'preferred_date', 'date'],
      createdAt
    );

    return {
      id: getFirstString(row, ['id']),
      name: getFirstString(row, ['name']),
      email: getFirstString(row, ['email']),
      appointmentLocation: getFirstString(row, ['appointment_location', 'appointmentLocation', 'location'], 'Nigeria'),
      appointmentDate,
      appointmentType: getFirstString(
        row,
        ['appointment_type', 'appointmenttype', 'appointmentType', 'type'],
        'general'
      ) as AppointmentRequest['appointmentType'],
      message: getFirstString(row, ['message']),
      createdAt,
      status: getFirstString(row, ['status'], 'pending') as AppointmentRequest['status'],
    };
  });
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
