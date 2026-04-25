export default function VillePrixSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8 animate-pulse">
      {/* En-tête */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-36 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-28 bg-gray-100 rounded-full" />
          <div className="h-6 w-32 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Tableau */}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 w-32" />
            <th className="px-4 py-3 text-center">
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
            </th>
            <th className="px-4 py-3 text-center">
              <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
            </th>
          </tr>
        </thead>
        <tbody>
          {['Ancien', 'Neuf'].map((row) => (
            <tr key={row} className="border-b border-gray-100 last:border-0">
              <th className="px-4 py-4 bg-gray-50">
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </th>
              <td className="px-4 py-4 text-center bg-primary-50">
                <div className="h-5 w-28 bg-gray-200 rounded mx-auto" />
              </td>
              <td className="px-4 py-4 text-center">
                <div className="h-5 w-28 bg-gray-200 rounded mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Note */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="h-3 w-64 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
