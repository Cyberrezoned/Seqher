'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateAppointmentStatus, deleteAppointment } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AppointmentDetails({ appointment }: { appointment: AppointmentRequest }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AppointmentRequest['status']>(appointment.status);
  const { toast } = useToast();
  const router = useRouter();

  const onSave = async () => {
    setLoading(true);
    try {
      const result = await updateAppointmentStatus({ id: appointment.id, status });
      if (!result.success) throw new Error(result.message);
      toast({ title: 'Saved', description: result.message });
      router.refresh();
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm('Delete this appointment request? This cannot be undone.');
    if (!confirmed) return;
    setLoading(true);
    try {
      const result = await deleteAppointment(appointment.id);
      if (!result.success) throw new Error(result.message);
      toast({ title: 'Deleted', description: result.message });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Status</span>
            <div className="col-span-3">
              <Select value={status} onValueChange={(v) => setStatus(v as AppointmentRequest['status'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
