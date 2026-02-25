
import Link from 'next/link';

import { procedures } from '@/lib/data';
import ProcedureCard from '@/components/ProcedureCard';

export const metadata = { title: 'Treatments' };

const subcategories = [
  {
    slug: 'cardiology',
    title: 'Cardiology',
    description: 'Heart surgery and interventional care with transparent treatment plans.',
  },
  {
    slug: 'oncology',
    title: 'Oncology',
    description: 'Cancer care programs from diagnostics to medical and targeted therapies.',
  },
  {
    slug: 'cosmetics',
    title: 'Cosmetics',
    description: 'Aesthetic and reconstructive options with specialist consultation support.',
  },
  {
    slug: 'wellness',
    title: 'Wellness',
    description: 'Preventive and recovery-focused holistic care packages for medical travelers.',
  },
] as const;

export default function TreatmentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Treatments</h1>
      <p className="text-slate-600">Browse specialty sections to quickly compare treatment packages by your medical need.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subcategories.map((section) => (
          <Link key={section.slug} href={`/treatments/${section.slug}`} className="block border rounded-2xl p-4 hover:border-brand-500 hover:bg-brand-50/40 transition">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{section.description}</p>
            <span className="mt-3 inline-block text-sm font-medium text-brand-700">View {section.title} treatments →</span>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold pt-2">All procedures</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {procedures.map((pr) => (<ProcedureCard key={pr.id} procedure={pr} />))}
      </div>
    </div>
  );
}
