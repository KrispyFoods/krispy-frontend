import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Geist } from 'next/font/google';
import './globals.css';
import { Footer, Header } from '@/components/organisms';
import { getNav, getSite } from '@/lib/db';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

// next/font exposes these as CSS variables, which globals.css maps to font-display / font-sans
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Krispi',
  description: 'Crispy chicken takeaway',
  openGraph: {
    title: 'Krispy',
    description: 'Crispy chicken takeaway',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, nav] = await Promise.all([getSite(), getNav()]);

  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        cormorant.variable,
        manrope.variable,
        'font-sans',
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Header nav={nav} />
          <main className="flex-1">{children}</main>
          <Footer site={site} nav={nav} />
        </Providers>
      </body>
    </html>
  );
}
