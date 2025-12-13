'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateNewsArticle } from './actions';
import type { NewsArticle } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const newsArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters.'),
  source: z.string().min(2, "Source must be at least 2 characters."),
  link: z.string().url("Please enter a valid URL."),
  imageId: z.string().min(1, 'Please select an image.'),
  publishedDate: z.date({ required_error: 'A published date is required.'}),
  category: z.enum(['Climate Action', 'Global Health', 'Education', 'Economic Growth', 'Peace and Justice', 'Sustainability']),
});

const imageOptions = PlaceHolderImages.filter(p => p.id.startsWith('news-'));
const categoryOptions = ['Climate Action', 'Global Health', 'Education', 'Economic Growth', 'Peace and Justice', 'Sustainability'] as const;

type NewsFormProps = {
  article?: NewsArticle;
};

export default function NewsForm({ article }: NewsFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newsArticleSchema>>({
    resolver: zodResolver(newsArticleSchema),
    defaultValues: {
      title: article?.title || '',
      summary: article?.summary || '',
      source: article?.source || '',
      link: article?.link || '',
      imageId: article?.imageId || '',
      publishedDate: article?.publishedDate ? new Date(article.publishedDate) : new Date(),
      category: article?.category || 'Sustainability',
    },
  });

  async function onSubmit(values: z.infer<typeof newsArticleSchema>) {
    setLoading(true);
    try {
        const result = await createOrUpdateNewsArticle({ ...values, id: article?.id });
        if(result.success) {
            toast({
                title: article ? "Article Updated" : "Article Created",
                description: `The article "${values.title}" has been saved.`,
            });
            router.push('/admin/news');
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
                  <FormLabel>Article Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., UN Report on Climate Change" {...field} />
                  </FormControl>
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
                    <Textarea
                      placeholder="A short summary of the news article."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>News Source</FormLabel>
                    <FormControl>
                        <Input placeholder="E.g., UN News" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Article Link</FormLabel>
                    <FormControl>
                        <Input placeholder="https://news.un.org/..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="publishedDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Published Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={'outline'}
                                className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                )}
                                >
                                {field.value ? (
                                    format(field.value, 'PPP')
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="imageId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Article Image</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a cover image" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {imageOptions.map(image => (
                            <SelectItem key={image.id} value={image.id}>{image.description}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>Select a placeholder image that represents the article.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {article ? 'Update Article' : 'Create Article'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
