'use client';

import { usePathname } from 'next/navigation';

import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { MotionProvider } from '@/context/MotionContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isAdminRoute) {
    return (
      <LanguageProvider>
        <MotionProvider key={pathname}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </MotionProvider>
        <Toaster />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <MotionProvider key={pathname}>
          <main className="flex-grow">{children}</main>
        </MotionProvider>
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  );
}
