'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { VolunteerApplication } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { updateVolunteerApplication, deleteVolunteerApplication } from './actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export default function VolunteerDetails({ application }: { application: VolunteerApplication }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialStatus = application.status ?? 'new';
  const [status, setStatus] = useState<(typeof statusOptions)[number]['value']>(initialStatus);
  const [notes, setNotes] = useState(application.adminNotes ?? '');

  const interests = useMemo(() => (application.interests || []).filter(Boolean), [application.interests]);

  const onSave = async () => {
    setLoading(true);
    try {
      const result = await updateVolunteerApplication({
        id: application.id,
        status,
        adminNotes: notes,
      });
      if (!result.success) throw new Error(result.message);
      toast({ title: 'Saved', description: result.message });
      router.refresh();
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm('Delete this volunteer application? This cannot be undone.');
    if (!confirmed) return;
    setLoading(true);
    try {
      const result = await deleteVolunteerApplication(application.id);
      if (!result.success) throw new Error(result.message);
      toast({ title: 'Deleted', description: result.message });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({
        title: 'Delete failed',
        description: err?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Volunteer Application</DialogTitle>
          <DialogDescription>Details and admin notes for {application.name}.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Name</span>
            <span className="col-span-3">{application.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Email</span>
            <a href={`mailto:${application.email}`} className="col-span-3 text-primary hover:underline">
              {application.email}
            </a>
          </div>
          {application.phone ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-bold">Phone</span>
              <a href={`tel:${application.phone}`} className="col-span-3 text-primary hover:underline">
                {application.phone}
              </a>
            </div>
          ) : null}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Location</span>
            <span className="col-span-3">{application.preferredLocation}</span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-bold">Interests</span>
            <div className="col-span-3 text-muted-foreground">
              {interests.length ? (
                <ul className="list-disc pl-5">
                  {interests.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              ) : (
                <span>None selected.</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-bold">Message</span>
            <p className="col-span-3 text-muted-foreground">{application.message?.trim() || 'No message provided.'}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Submitted</span>
            <span className="col-span-3">{format(new Date(application.createdAt), 'PPpp')}</span>
          </div>
        </div>

        <div className="grid gap-4 border-t pt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Status</span>
            <div className="col-span-3">
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-bold">Notes</span>
            <div className="col-span-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes (not visible publicly)"
                className="min-h-[110px]"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button variant="destructive" onClick={onDelete} disabled={loading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={onSave} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

