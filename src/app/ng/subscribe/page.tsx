import SubscribeClient from '@/app/ng/subscribe/SubscribeClient';

export default function NigeriaSubscribePage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Nigeria</p>
          <h1 className="mt-2 font-headline text-3xl font-bold md:text-5xl">Subscribe</h1>
          <p className="mt-4 text-muted-foreground">
            Subscribe to Nigeria-focused news, grants, and organizational updates in one place.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-xl border bg-secondary/30 p-5 text-sm text-muted-foreground">
          Delivery integration note: this subscription flow captures and validates subscriber data immediately.
          Email delivery provider setup (platform selection, payment, and API credentials) should be provided by the
          organization for full real-time broadcast automation.
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <SubscribeClient />
        </div>
      </div>
    </div>
  );
}
