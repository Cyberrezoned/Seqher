'use client';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { MotionProvider } from '@/context/MotionContext';
import { usePathname } from 'next/navigation';


// This cannot be a client component
// export const metadata: Metadata = {
//   title: 'SEQHER Digital Hub',
//   description: 'An NGO in alignment with SDG GOALS',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  return (
    <html lang="en" className="h-full">
      <head>
        <title>SEQHER Digital Hub</title>
        <meta name="description" content="An NGO in alignment with SDG GOALS" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col bg-background')}>
        <AuthProvider>
            {!isLanding && <Header />}
            <MotionProvider key={pathname}>
              <main className="flex-grow">{children}</main>
            </MotionProvider>
            {!isLanding && <Footer />}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
