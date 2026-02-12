'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { subscribeForNewsUpdates } from '@/app/ng/news/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const subscribeSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
});

export default function NewsSubscribeForm({ locale = 'ng' }: { locale?: 'ng' | 'ca' | 'global' }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof subscribeSchema>>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { name: '', email: '' },
  });

  async function onSubmit(values: z.infer<typeof subscribeSchema>) {
    setLoading(true);
    try {
      const result = await subscribeForNewsUpdates({ ...values, locale });
      if (result.success) {
        toast({
          title: 'Subscribed',
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          title: 'Subscription failed',
          description: result.message,
          variant: 'destructive',
        });
        if (result.field) {
          form.setError(result.field as keyof z.infer<typeof subscribeSchema>, {
            type: 'server',
            message: result.message,
          });
        }
      }
    } catch {
      toast({
        title: 'Server error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border bg-background/70">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Subscribe for News Updates</CardTitle>
        <CardDescription>Get important updates from SEQHER delivered to your inbox.</CardDescription>
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
            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              Subscribe
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
