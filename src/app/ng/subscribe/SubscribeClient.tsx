'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail } from 'lucide-react';

import { subscribeToNigeriaUpdates } from '@/app/ng/subscribe/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const subscribeSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  topics: z.array(z.enum(['news', 'grants', 'organization_updates'])).min(1, {
    message: 'Select at least one subscription category.',
  }),
  grantPlan: z.enum(['monthly', 'annual']).optional(),
});

const topicOptions = [
  {
    value: 'news' as const,
    label: 'News',
    description: 'Receive Nigeria news and story updates.',
  },
  {
    value: 'grants' as const,
    label: 'Grants',
    description: 'Receive grant and funding opportunity alerts.',
  },
  {
    value: 'organization_updates' as const,
    label: 'Organizational Updates',
    description: 'Receive SEQHER organizational updates and announcements.',
  },
];

type FormValues = z.infer<typeof subscribeSchema>;

export default function SubscribeClient() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      name: '',
      email: '',
      topics: ['news', 'organization_updates'],
      grantPlan: 'monthly',
    },
  });

  const selectedTopics = form.watch('topics');
  const includesGrants = useMemo(() => selectedTopics.includes('grants'), [selectedTopics]);

  const toggleTopic = (topic: FormValues['topics'][number], checked: boolean) => {
    const currentTopics = form.getValues('topics');
    const nextTopics = checked
      ? Array.from(new Set([...currentTopics, topic]))
      : currentTopics.filter((item) => item !== topic);
    form.setValue('topics', nextTopics, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload: FormValues = {
        ...values,
        grantPlan: values.topics.includes('grants') ? values.grantPlan ?? 'monthly' : undefined,
      };
      const result = await subscribeToNigeriaUpdates(payload);
      if (result.success) {
        toast({
          title: 'Subscribed',
          description: result.message,
        });
        form.reset({
          name: '',
          email: '',
          topics: ['news', 'organization_updates'],
          grantPlan: 'monthly',
        });
      } else {
        toast({
          title: 'Subscription failed',
          description: result.message,
          variant: 'destructive',
        });
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
  };

  return (
    <Card className="border bg-background/80">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Subscribe for Nigeria Updates</CardTitle>
        <CardDescription>
          Use one form to subscribe for news, grants, and organizational updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="topics"
              render={() => (
                <FormItem>
                  <FormLabel>Subscription Categories</FormLabel>
                  <div className="grid gap-3 md:grid-cols-3">
                    {topicOptions.map((topic) => {
                      const checked = selectedTopics.includes(topic.value);
                      return (
                        <label
                          key={topic.value}
                          className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background/40 p-4"
                        >
                          <Checkbox checked={checked} onCheckedChange={(value) => toggleTopic(topic.value, value === true)} />
                          <span className="space-y-1">
                            <span className="block text-sm font-semibold text-foreground">{topic.label}</span>
                            <span className="block text-xs text-muted-foreground">{topic.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {includesGrants ? (
              <FormField
                control={form.control}
                name="grantPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grant Subscription Plan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
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
            ) : null}

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
