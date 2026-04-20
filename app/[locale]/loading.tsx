export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="skeleton h-4 w-48 mb-6" />
      <div className="skeleton h-10 w-2/3 mb-3" />
      <div className="skeleton h-5 w-full max-w-xl mb-2" />
      <div className="skeleton h-5 w-3/4 mb-8" />
      <div className="skeleton h-24 rounded-xl mb-8" />
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="skeleton h-6 w-40 mb-6" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-4 w-20" />
              </div>
              <div className="skeleton h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="skeleton h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <div className="skeleton h-3 w-20 mb-3" />
              <div className="skeleton h-7 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
