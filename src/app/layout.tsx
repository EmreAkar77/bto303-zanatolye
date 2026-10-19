import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Atölyem — Zanaat & Teknoloji Workshop Kayıt Platformu',
  description: 'Geleneksel Türk zanaatleri ve modern teknoloji atölyeleri yönetim ve kayıt platformu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50/50 text-neutral-900 selection:bg-amber-200">
        <Suspense fallback={<header className="h-16 bg-white border-b border-amber-100 shadow-xs" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
