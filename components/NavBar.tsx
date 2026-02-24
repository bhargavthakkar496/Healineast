'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/treatments', label: 'Treatments' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/hospitals', label: 'Hospitals' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/visa', label: 'Medical Visa' },
  { href: '/insurance', label: 'Insurance' },
  { href: '/dashboard', label: 'Dashboard' },
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="text-xl font-extrabold text-brand-700">
          HealinginEast
        </Link>
        <nav className="hidden gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn('hover:text-brand-700', pathname === link.href && 'font-medium text-brand-700')}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm md:hidden">Menu</div>
      </div>
    </header>
  );
}
