'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { AppointmentRequest } from '@/lib/types';

export default function AppointmentDetails({ appointment }: { appointment: AppointmentRequest }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            Details for the appointment request from {appointment.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Name</span>
            <span className="col-span-3">{appointment.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Email</span>
            <a href={`mailto:${appointment.email}`} className="col-span-3 text-primary hover:underline">{appointment.email}</a>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Type</span>
            <span className="col-span-3 capitalize">{appointment.appointmentType}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Location</span>
            <span className="col-span-3">{appointment.appointmentLocation}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Preferred Date</span>
            <span className="col-span-3">{format(new Date(appointment.appointmentDate), 'PPP')}</span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-bold">Message</span>
            <p className="col-span-3 text-muted-foreground">{appointment.message || 'No message provided.'}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Submitted</span>
            <span className="col-span-3">{format(new Date(appointment.createdAt), 'PPpp')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
