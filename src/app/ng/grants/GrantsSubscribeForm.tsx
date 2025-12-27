'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { subscribeForGrantAccess } from '@/app/ng/grants/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const subscribeSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  plan: z.enum(['monthly', 'annual']),
});

type Props = {
  onSubscribed?: () => void;
};

const STORAGE_KEY = 'seqher_grants_access_v1';

export function hasLocalGrantsAccess(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === 'true';
}

export default function GrantsSubscribeForm({ onSubscribed }: Props) {
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasAccess(hasLocalGrantsAccess());
  }, []);

  const form = useForm<z.infer<typeof subscribeSchema>>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { name: '', email: '', plan: 'monthly' },
  });

  async function onSubmit(values: z.infer<typeof subscribeSchema>) {
    setLoading(true);
    try {
      const result = await subscribeForGrantAccess({ ...values, locale: 'ng' });
      if (result.success) {
        window.localStorage.setItem(STORAGE_KEY, 'true');
        setHasAccess(true);
        toast({ title: 'Subscribed', description: result.message });
        onSubscribed?.();
      } else {
        toast({ title: 'Subscription failed', description: result.message, variant: 'destructive' });
        if (result.field) {
          form.setError(result.field as keyof z.infer<typeof subscribeSchema>, {
            type: 'server',
            message: result.message,
          });
        }
      }
    } catch (error) {
      toast({ title: 'Server error', description: 'An unexpected error occurred. Please try again later.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border bg-background/70">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Subscribe to View Full Grant Details</CardTitle>
        <CardDescription>
          Choose a plan to unlock full details for grants and funding opportunities.
          {hasAccess ? <span className="ml-2 font-semibold text-primary">Access active on this device.</span> : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
              Subscribe
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

