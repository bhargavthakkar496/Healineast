
import { doctors, providers } from '@/lib/data';

export const metadata = { title: 'Doctors' };

export default function DoctorsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((d) => {
          const provider = providers.find((p) => p.id === d.provider_id);
          return (
            <div key={d.id} className="border rounded-2xl p-4">
              <h3 className="font-semibold">{d.name}</h3>
              <p className="text-sm text-slate-600">{d.specialties.join(', ')} · {d.experience_years} yrs</p>
              <p className="text-sm">Languages: {d.languages.join(', ')}</p>
              <p className="text-sm">Hospital: {provider?.org_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
