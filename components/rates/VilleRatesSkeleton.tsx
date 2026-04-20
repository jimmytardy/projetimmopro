export default function VilleRatesSkeleton() {
  return (
    <>
      {/* Badge */}
      <div className="skeleton h-6 w-48 rounded-full mb-6" />

      {/* 4 cartes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <div className="skeleton h-5 w-5 rounded mx-auto mb-2" />
            <div className="skeleton h-3 w-24 rounded mx-auto mb-1" />
            <div className="skeleton h-6 w-16 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-4 w-16" />
          ))}
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex gap-8 px-4 py-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="skeleton h-4 w-14" />
            ))}
          </div>
        ))}
      </div>
      <div className="skeleton h-3 w-64 mt-2" />
    </>
  )
}
