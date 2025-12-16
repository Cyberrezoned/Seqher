'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateAnnouncement } from './actions';
import type { Announcement } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  locale: z.enum(['ng','ca','global']).default('ng'),
});

type AnnouncementFormProps = {
  announcement?: Announcement;
};

export default function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title || '',
      content: announcement?.content || '',
      locale: announcement?.locale || 'ng',
    },
  });

  async function onSubmit(values: z.infer<typeof announcementSchema>) {
    setLoading(true);
    try {
        const result = await createOrUpdateAnnouncement({ ...values, id: announcement?.id });
        if(result.success) {
            toast({
                title: announcement ? "Announcement Updated" : "Announcement Created",
                description: `Your announcement "${values.title}" has been saved.`,
            });
            router.push('/admin/announcements');
            router.refresh();
        } else {
            throw new Error(result.message);
        }
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Something went wrong.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Important Update" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Details about the announcement..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locale</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="ng">Nigeria</option>
                      <option value="ca">Canada</option>
                      <option value="global">Global</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {announcement ? 'Update Announcement' : 'Create Announcement'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
