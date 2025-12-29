'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { deleteGrantSubscription } from './actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export type GrantSubscriptionRow = {
  id: string;
  name: string;
  email: string;
  plan: 'monthly' | 'annual';
  locale: 'ng' | 'ca' | 'global';
  createdAt: string;
};

export default function GrantSubscriptionDetails({ subscription }: { subscription: GrantSubscriptionRow }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    const confirmed = window.confirm('Delete this grant request? This cannot be undone.');
    if (!confirmed) return;
    setLoading(true);
    try {
      const result = await deleteGrantSubscription(subscription.id);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Grant Request</DialogTitle>
          <DialogDescription>Details for {subscription.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Name</span>
            <span className="col-span-3">{subscription.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Email</span>
            <a href={`mailto:${subscription.email}`} className="col-span-3 text-primary hover:underline">
              {subscription.email}
            </a>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Plan</span>
            <span className="col-span-3 capitalize">{subscription.plan}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Locale</span>
            <span className="col-span-3 uppercase">{subscription.locale}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-bold">Submitted</span>
            <span className="col-span-3">{format(new Date(subscription.createdAt), 'PPpp')}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button onClick={() => setOpen(false)} disabled={loading} variant="secondary">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

