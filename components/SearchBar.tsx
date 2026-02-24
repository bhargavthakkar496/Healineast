
'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [procedure, setProcedure] = useState('');
  const [destination, setDestination] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (procedure) params.set('q', procedure);
    if (destination) params.set('city', destination);
    router.push(`/hospitals?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <input className="border rounded-xl px-4 py-3" placeholder="Procedure (CABG, IVF, Rhinoplasty)" value={procedure} onChange={(e) => setProcedure(e.target.value)} />
      <input className="border rounded-xl px-4 py-3" placeholder="Destination (New Delhi, Dubai, Kathmandu)" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-6 py-3">Search</button>
    </form>
  );
}
