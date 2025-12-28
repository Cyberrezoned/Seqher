'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const paymentSchema = z.object({
  name: z.string().min(2, { message: 'Name on card is required.' }),
  cardNumber: z.string().min(16, { message: 'Card number must be 16 digits.' }).max(16),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Use MM/YY format.' }),
  cvc: z.string().min(3, { message: 'CVC must be 3-4 digits.' }).max(4),
  amount: z.coerce.number().min(5, { message: 'Donation must be at least $5.' }),
});

const heroImage = PlaceHolderImages.find((p) => p.id === 'donate-hero');

export default function DonatePage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const donationAccountId = process.env.NEXT_PUBLIC_DONATION_ACCOUNT_ID || '';
  const donationDestinationLabel = process.env.NEXT_PUBLIC_DONATION_DESTINATION_LABEL || '';

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      amount: 50,
    },
  });

  function onSubmit(values: z.infer<typeof paymentSchema>) {
    setLoading(true);
    // This is a demo form (no payment processor configured).
    // We simulate a delay and show a success message for UI preview only.
    setTimeout(() => {
        toast({
            title: "Thank You For Your Support!",
            description: `Your generous donation of $${values.amount} is greatly appreciated.`,
        });
        setLoading(false);
        form.reset();
    }, 1500);
  }

  return (
    <>
      <section className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Support Our Mission in Nigeria</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Your generosity fuels our work and creates lasting change.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="mb-6 border bg-background/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Donation destination</CardTitle>
              <CardDescription>
                Payments are not yet enabled on this website. This page is a preview-only donation form and will not charge any card.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <span className="font-semibold text-foreground">Account ID:</span>{' '}
                {donationAccountId ? <span className="text-foreground">{donationAccountId}</span> : 'Not configured yet.'}
              </p>
              <p>
                <span className="font-semibold text-foreground">Destination:</span>{' '}
                {donationDestinationLabel ? (
                  <span className="text-foreground">{donationDestinationLabel}</span>
                ) : (
                  'Contact us for the current donation account details.'
                )}
              </p>
              <p>
                Email:{' '}
                <a className="text-primary hover:underline" href="mailto:info@seqher.org?subject=Donation%20Support">
                  info@seqher.org
                </a>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Every contribution helps us empower communities and protect our planet.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount (USD)</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input type="number" placeholder="50" className="pl-7" {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                    <Input placeholder="John M. Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input placeholder="0000 0000 0000 0000" className="pl-10" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expires</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="cvc"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" size="lg" className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : 'Donate Now'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
