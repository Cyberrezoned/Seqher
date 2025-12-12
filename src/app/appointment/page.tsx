'use client';
import AppointmentForm from './AppointmentForm';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const heroImage = PlaceHolderImages.find(p => p.id === 'appointment-hero');

export default function AppointmentPage() {

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
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Book an Appointment</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground">
            Schedule a time to discuss volunteering, partnerships, or learn more about our work.
          </p>
        </div>
      </section>
      <div className="container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <AppointmentForm />
        </div>
      </div>
    </>
  );
}
