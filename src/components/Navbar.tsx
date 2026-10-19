'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Atölyeler' },
    { href: '/instructors', label: 'Eğitmenler' },
    { href: '/admin', label: 'Yönetim Paneli' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marka */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              A
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-amber-700 transition-colors">
                Atölyem
              </span>
              <span className="text-2xs font-medium text-amber-700 -mt-1 tracking-wider uppercase">
                Zanaat & Teknoloji
              </span>
            </div>
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-amber-100/80 text-amber-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/workshops/new"
              className="ml-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all hover:shadow"
            >
              <span>+</span> Yeni Atölye
            </Link>
          </nav>

          {/* Mobil Menü Butonu */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-hidden"
              aria-label="Menüyü aç/kapat"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Açılır Menü (375px uyumlu) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/workshops/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center mt-3 px-4 py-2.5 rounded-lg text-base font-semibold text-white bg-amber-600 hover:bg-amber-700"
          >
            + Yeni Atölye Aç
          </Link>
        </div>
      )}
    </header>
  );
}
