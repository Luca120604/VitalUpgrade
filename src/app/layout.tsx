import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VitalUpgrade — Mobile-first Health Companion',
  description:
    'Track vitals, spot trends, and get actionable nudges on your phone.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='min-h-full bg-zinc-50 text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50'>
        {children}
      </body>
    </html>
  );
}
