
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import HospitalCard from '@/components/HospitalCard';
import { providers, procedures } from '@/lib/data';
import ProcedureCard from '@/components/ProcedureCard';
import JSONLDSchema from '@/components/JSONLDSchema';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <JSONLDSchema />
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">HealinginEast — Accredited care, organised end-to-end</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Compare NABH/JCI hospitals in India, Nepal, UAE, and Russia. Get help with medical visas, flights, stays, translators, and insurance in one secure dashboard.</p>
        <div className="max-w-3xl mx-auto"><SearchBar /></div>
        <div className="text-sm text-slate-600">Popular: CABG · IVF · Rhinoplasty · Chemotherapy</div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured hospitals</h2>
          <Link className="text-brand-700 text-sm" href="/hospitals">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.slice(0,4).map((p) => (<HospitalCard key={p.id} provider={p} />))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Focus specialties</h2>
          <Link className="text-brand-700 text-sm" href="/treatments">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {procedures.map((pr) => (<ProcedureCard key={pr.id} procedure={pr} />))}
        </div>
      </section>
    </div>
  );
}
