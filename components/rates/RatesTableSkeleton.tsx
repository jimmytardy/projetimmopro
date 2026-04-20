export default function RatesTableSkeleton() {
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <div className="skeleton h-6 w-28 rounded-full" />
        <div className="skeleton h-6 w-48 rounded-full" />
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-8">
          {['Durée', 'Taux moyen', 'Mensualité', 'Coût intérêts'].map((h) => (
            <div key={h} className="skeleton h-4 w-20" />
          ))}
        </div>
        {[10, 15, 20, 25].map((_, i) => (
          <div
            key={i}
            className={`flex gap-8 px-4 py-3 border-b border-gray-100 last:border-0 ${
              i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="skeleton h-3 w-72 mt-2" />
    </div>
  )
}
