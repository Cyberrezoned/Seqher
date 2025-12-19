'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { AdminNewsPost } from './types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateNewsArticle } from './actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const newsPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters.')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters.'),
  content: z.string().optional(),
  imageId: z.string().optional(),
  locale: z.enum(['ng', 'ca', 'global']).default('ng'),
});

const imageOptions = PlaceHolderImages.filter((p) => p.id.startsWith('news-'));

type NewsFormProps = {
  post?: AdminNewsPost;
};

export default function NewsForm({ post }: NewsFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newsPostSchema>>({
    resolver: zodResolver(newsPostSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      summary: post?.summary || '',
      content: post?.content || '',
      imageId: post?.imageId || 'news-hero',
      locale: post?.locale || 'ng',
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    form.setValue('title', title);
    form.setValue('slug', slug);
  };

  async function onSubmit(values: z.infer<typeof newsPostSchema>) {
    setLoading(true);
    try {
      const result = await createOrUpdateNewsArticle({ ...values, id: post?.id });
      if (result.success) {
        toast({
          title: post ? 'Post Updated' : 'Post Created',
          description: `The news post "${values.title}" has been saved.`,
        });
        router.push('/admin/news');
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
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
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input placeholder="International Human Rights Day" {...field} onChange={handleTitleChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="international-human-rights-day" {...field} />
                  </FormControl>
                  <FormDescription>Used to identify the post in URLs and admin tools.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short summary for lists/cards." className="min-h-[100px]" {...field} />
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
                  <FormLabel>Content (HTML allowed)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full post content..." className="min-h-[240px]" {...field} />
                  </FormControl>
                  <FormDescription>
                    Paste WordPress/Gutenberg HTML here. The public site uses a sanitized renderer.
                  </FormDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a locale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ng">Nigeria</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select which site this post is for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cover image" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {imageOptions.map((image) => (
                        <SelectItem key={image.id} value={image.id}>
                          {image.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a placeholder image that represents the post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {post ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

