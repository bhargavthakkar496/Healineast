import { Procedure } from '@/lib/schema';
import { currency } from '@/lib/utils';
import QuoteForm from '@/components/QuoteForm';

export default function ProcedureCard({ procedure }: { procedure: Procedure }) {
  return (
    <div className="border rounded-2xl p-4">
      <h3 className="font-semibold">{procedure.name}</h3>
      <p className="text-sm text-slate-600">Specialty: {procedure.specialty}</p>
      <p className="mt-2">
        Starting at <strong>{currency(procedure.base_price, procedure.currency)}</strong>
      </p>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer">Inclusions/Exclusions</summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <ul className="list-disc ml-5">{procedure.inclusions.map((i) => <li key={i}>{i}</li>)}</ul>
          <ul className="list-disc ml-5">{procedure.exclusions.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      </details>

      <div className="mt-4 border-t pt-4">
        <h4 className="font-medium">Request a quote on WhatsApp + email</h4>
        <QuoteForm procedureId={procedure.id} />
      </div>
    </div>
  );
}
