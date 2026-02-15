import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PT_Sans } from 'next/font/google';

import './globals.css';
 import { cn } from '@/lib/utils';
import { Providers } from '@/app/providers';
import { getHtmlLangFromCookies } from '@/lib/i18n/locale';
import { getSiteOrigin } from '@/lib/seo/site';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  title: {
    default: 'SEQHER',
    template: '%s | SEQHER',
  },
  description: 'Society for Equal Health and Rights (SEQHER) — an NGO advancing equal health and rights.',
  applicationName: 'SEQHER',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'SEQHER',
    title: 'SEQHER',
    description: 'Society for Equal Health and Rights (SEQHER) — an NGO advancing equal health and rights.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEQHER',
    description: 'Society for Equal Health and Rights (SEQHER) — an NGO advancing equal health and rights.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const htmlLang = getHtmlLangFromCookies(cookieStore);

  return (
    <html lang={htmlLang} className={cn('h-full', ptSans.variable)}>
      <body className={cn('font-body antialiased min-h-screen flex flex-col bg-background')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
