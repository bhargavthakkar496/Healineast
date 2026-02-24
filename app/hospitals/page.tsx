
import HospitalCard from '@/components/HospitalCard';
import { providers, procedures } from '@/lib/data';

export const metadata = { title: 'Hospitals' };

function filterProviders(q?: string, city?: string, specialty?: string) {
  let list = providers.filter((p) => p.accreditations.includes('JCI') || p.accreditations.includes('NABH'));
  if (city) list = list.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
  if (specialty) list = list.filter((p) => p.specialties.map(s=>s.toLowerCase()).includes(specialty.toLowerCase() as any));
  if (q) {
    const procProviders = new Set(
      procedures.filter((pr) => pr.name.toLowerCase().includes(q.toLowerCase())).map((pr) => pr.provider_id)
    );
    list = list.filter((p) => procProviders.has(p.id));
  }
  return list;
}

export default function HospitalsPage({ searchParams }: { searchParams: { q?: string; city?: string; specialty?: string } }) {
  const list = filterProviders(searchParams.q, searchParams.city, searchParams.specialty);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Hospitals (NABH/JCI)</h1>
      <p className="text-slate-600">Accredited providers with transparent packages in India, Nepal, UAE, and Russia.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((p) => (<HospitalCard key={p.id} provider={p} />))}
      </div>
    </div>
  );
}
