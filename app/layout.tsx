
import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: { absolute: 'HealinginEast', default: 'HealinginEast – Medical Tourism Aggregator', template: '%s | HealinginEast' },
  description: 'HealinginEast helps international patients compare accredited hospitals (NABH/JCI), request quotes, and arrange visas, travel, stays, and insurance.',
  keywords: ['medical tourism','medical visa','NABH','JCI','hospitals','doctors','insurance','travel','India','Nepal','UAE','Russia'],
  openGraph: { title: 'HealinginEast', description: 'End-to-end medical travel and visa assistance', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="container py-8">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
