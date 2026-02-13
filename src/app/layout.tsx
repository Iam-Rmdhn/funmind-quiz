import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'FunMind - Playful Learning',
  description: 'A fun and interactive quiz application with a cartoon theme.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${quicksand.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
