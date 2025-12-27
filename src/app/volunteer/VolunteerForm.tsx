'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, MapPin, Send } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { submitVolunteerForm } from '@/app/volunteer/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const interestOptions = [
  'Community outreach',
  'Health promotion',
  'Human rights & advocacy',
  'Youth engagement',
  'Research & data support',
  'Communications & media',
  'Administrative support',
  'Fundraising & partnerships',
] as const;

const volunteerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  phone: z.string().max(40).optional(),
  preferredLocation: z.string().min(2, { message: 'Select a preferred location.' }),
  interests: z.array(z.string()).default([]),
  message: z.string().max(800).optional(),
});

const nigeriaLocations = [
  { value: 'Maiduguri (Borno State)', label: 'Maiduguri (Borno State)' },
  { value: 'Abuja', label: 'Abuja' },
  { value: 'Kogi State', label: 'Kogi State' },
  { value: 'Remote/Online', label: 'Remote/Online' },
  { value: 'Other (Nigeria)', label: 'Other (Nigeria)' },
] as const;

const canadaLocations = [
  { value: 'Toronto, ON', label: 'Toronto, ON' },
  { value: 'Ottawa, ON', label: 'Ottawa, ON' },
  { value: 'Montréal, QC', label: 'Montréal, QC' },
  { value: 'Vancouver, BC', label: 'Vancouver, BC' },
  { value: 'Calgary, AB', label: 'Calgary, AB' },
] as const;

type Locale = 'ng' | 'ca' | 'global';

export default function VolunteerForm({ locale = 'ng' }: { locale?: Locale }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const locations = locale === 'ca' ? canadaLocations : nigeriaLocations;

  const form = useForm<z.infer<typeof volunteerSchema>>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferredLocation: '',
      interests: [],
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof volunteerSchema>) {
    setLoading(true);
    try {
      const result = await submitVolunteerForm({ ...values, locale });
      if (result.success) {
        toast({ title: 'Submitted', description: result.message });
        form.reset();
      } else {
        toast({ title: 'Submission failed', description: result.message, variant: 'destructive' });
        if (result.field) {
          form.setError(result.field as keyof z.infer<typeof volunteerSchema>, {
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
        <CardTitle className="font-headline text-2xl">Volunteer Pathway</CardTitle>
        <CardDescription>Share your details and preferred location. Our team will reach out with next steps.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder={locale === 'ca' ? '+1…' : '+234…'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Volunteer Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas of Interest (optional)</FormLabel>
                  <div className="grid gap-3 md:grid-cols-2">
                    {interestOptions.map((option) => {
                      const checked = field.value?.includes(option) ?? false;
                      return (
                        <label key={option} className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(next) => {
                              const isChecked = Boolean(next);
                              const current = new Set(field.value ?? []);
                              if (isChecked) current.add(option);
                              else current.delete(option);
                              field.onChange(Array.from(current));
                            }}
                            aria-label={option}
                          />
                          <span className="text-sm">
                            <span className="font-semibold text-foreground">{option}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anything else? (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us your availability, preferred role, or any other details."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Volunteer Details
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <p>
                Preferred location helps us match you to opportunities. You can also request remote/online volunteering.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
