'use client';

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
import { useFirebase } from "@/context/FirebaseContext";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { AppointmentRequest } from "@/lib/types";
import { useEffect, useState } from "react";
import AppointmentDetails from "./AppointmentDetails";


export default function AdminAppointmentsPage() {
  const { db } = useFirebase();
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  
  useEffect(() => {
    if (!db) return;

    async function getAppointments(): Promise<AppointmentRequest[]> {
      const appointmentsQuery = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(appointmentsQuery);
      const list = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
              id: doc.id, 
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
              appointmentDate: data.appointmentDate?.toDate ? data.appointmentDate.toDate().toISOString() : new Date().toISOString(),
          } as AppointmentRequest
      });
      return list;
    }

    getAppointments().then(setAppointments);
  }, [db]);

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
                <TableHead className="hidden lg:table-cell">Preferred Date</TableHead>
                <TableHead className="hidden lg:table-cell">Type</TableHead>
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
                    {format(new Date(item.appointmentDate), 'PP')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell capitalize">
                    {item.appointmentType}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.createdAt), 'PPpp')}
                  </TableCell>
                  <TableCell>
                    <AppointmentDetails appointment={item} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {appointments.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No appointment requests yet.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
