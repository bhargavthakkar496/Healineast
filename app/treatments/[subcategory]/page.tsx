import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProcedureCard from '@/components/ProcedureCard';
import { procedures } from '@/lib/data';

const categoryConfig = {
  cardiology: { title: 'Cardiology', specialties: ['Cardiac'] },
  oncology: { title: 'Oncology', specialties: ['Oncology'] },
  cosmetics: { title: 'Cosmetics', specialties: ['Cosmetics'] },
  wellness: { title: 'Wellness', specialties: ['Wellness'] },
} as const;

type CategoryKey = keyof typeof categoryConfig;

export function generateStaticParams() {
  return Object.keys(categoryConfig).map((subcategory) => ({ subcategory }));
}

export default function TreatmentSubcategoryPage({ params }: { params: { subcategory: string } }) {
  const category = categoryConfig[params.subcategory as CategoryKey];

  if (!category) {
    notFound();
  }

  const filteredProcedures = procedures.filter((procedure) =>
    (category.specialties as readonly string[]).includes(procedure.specialty)
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Link href="/treatments" className="text-sm text-brand-700 hover:underline">
          ← Back to all treatments
        </Link>
        <h1 className="text-2xl font-bold">{category.title} Treatments</h1>
        <p className="text-slate-600">Compare procedure options, inclusions, and estimated stay durations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProcedures.map((procedure) => (
          <ProcedureCard key={procedure.id} procedure={procedure} />
        ))}
      </div>
    </div>
  );
}
