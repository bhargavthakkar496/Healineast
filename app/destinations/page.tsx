
export const metadata = { title: 'Destinations' };

const destinations = [
  { country: 'India', cities: ['New Delhi','Mumbai'], notes: 'Wide specialty coverage; NABH/JCI network; English widely spoken.' },
  { country: 'Nepal', cities: ['Kathmandu'], notes: 'Fertility focus; proximity for SAARC patients.' },
  { country: 'UAE', cities: ['Dubai'], notes: 'Cosmetic & elective procedures; JCI hospitals; Arabic/English support.' },
  { country: 'Russia', cities: ['Moscow'], notes: 'Oncology & targeted therapy options; interpreter support.' },
];

export default function DestinationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Destinations</h1>
      <p className="text-slate-600">We currently route patients from Africa, SAARC (incl. Nepal), Russia, and the Middle East to accredited hospitals across these hubs.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {destinations.map((d) => (
          <div key={d.country} className="border rounded-2xl p-4">
            <h3 className="font-semibold">{d.country}</h3>
            <p className="text-sm">Cities: {d.cities.join(', ')}</p>
            <p className="text-sm text-slate-600">{d.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
