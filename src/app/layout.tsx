import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VITAL — Mobile-first Health Companion',
  description:
    'Swiss-grid, dark-first mobile health companion. Numbers over decoration.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
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
    <html lang='de'>
      <body className='min-h-full'>{children}</body>
    </html>
  );
}
