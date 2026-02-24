
import Link from 'next/link';
import { Provider } from '@/lib/schema';

export default function HospitalCard({ provider }: { provider: Provider }) {
  return (
    <div className="border rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{provider.org_name}</h3>
        {provider.verified && <span className="badge bg-green-100 text-green-700">Verified</span>}
      </div>
      <p className="text-sm text-slate-600">{provider.city}, {provider.country}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        {provider.accreditations.map((a) => (
          <span key={a} className="bg-slate-100 px-2 py-1 rounded">{a}</span>
        ))}
      </div>
      <div className="text-sm">Specialties: {provider.specialties.join(', ')}</div>
      <div className="text-sm">Languages: {provider.languages.join(', ')}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm">⭐ {provider.rating} ({provider.reviewCount})</div>
        <Link className="text-brand-700 text-sm" href={`/hospitals?provider=${provider.id}`}>View details</Link>
      </div>
    </div>
  );
}
