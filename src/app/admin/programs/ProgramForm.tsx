'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateProgram } from './actions';
import type { Program } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
import { Checkbox } from '@/components/ui/checkbox';

const programSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters.').max(200, 'Summary must be less than 200 characters.'),
  description: z.string().min(50, 'Description must be at least 50 characters.'),
  imageId: z.string().min(1, 'Please select an image.'),
  sdgGoals: z.array(z.number()).min(1, 'Please select at least one SDG goal.'),
  locale: z.enum(['ng','ca','global']).default('ng'),
});

const allSdgGoals = Array.from({ length: 17 }, (_, i) => i + 1);
const imageOptions = PlaceHolderImages.filter(p => p.id.startsWith('program-'));


type ProgramFormProps = {
  program?: Program;
};

export default function ProgramForm({ program }: ProgramFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: program?.title || '',
      summary: program?.summary || '',
      description: program?.description || '',
      imageId: program?.imageId || '',
      sdgGoals: program?.sdgGoals || [],
      locale: program?.locale || 'ng',
    },
  });

  async function onSubmit(values: z.infer<typeof programSchema>) {
    setLoading(true);
    try {
        const result = await createOrUpdateProgram({ ...values, id: program?.id });
        if(result.success) {
            toast({
                title: program ? "Program Updated" : "Program Created",
                description: `The program "${values.title}" has been saved.`,
            });
            router.push('/admin/programs');
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
                  <FormLabel>Program Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Youth Empowerment Initiative" {...field} />
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
                      placeholder="A short summary for program cards (max 200 characters)."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description for the program page."
                      className="min-h-[200px]"
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ng">Nigeria</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select which site this program belongs to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Image</FormLabel>
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
                   <FormDescription>Select a placeholder image that represents the program.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sdgGoals"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Associated SDG Goals</FormLabel>
                    <FormDescription>
                      Select all UN Sustainable Development Goals that apply to this program.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {allSdgGoals.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="sdgGoals"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              SDG {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {program ? 'Update Program' : 'Create Program'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
