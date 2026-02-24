
import { procedures } from '@/lib/data';
import ProcedureCard from '@/components/ProcedureCard';

export const metadata = { title: 'Treatments' };

export default function TreatmentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Treatments</h1>
      <p className="text-slate-600">Cardiac, Cosmetics, Fertility, and Oncology are our initial focus specialties with transparent inclusions.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {procedures.map((pr) => (<ProcedureCard key={pr.id} procedure={pr} />))}
      </div>
    </div>
  );
}
