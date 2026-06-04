import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWines } from '../../store/winesSlice'

export default function AdminWines() {
  const dispatch = useDispatch()
  const { list: wines, loading } = useSelector((state) => state.wines)

  useEffect(() => {
    dispatch(fetchWines())
  }, [dispatch])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Wines</h1>
        <Link to="/admin/wines/new" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-500 transition">
          Add Wine
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Producer</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Price</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Stock</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {wines.map((wine) => (
                <tr key={wine._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-900">{wine.name}</td>
                  <td className="px-4 py-3 text-stone-600">{wine.producer?.name}</td>
                  <td className="px-4 py-3 text-stone-600">${wine.price}</td>
                  <td className="px-4 py-3">
                    <span className={wine.stock > 0 ? 'text-green-600' : 'text-red-500'}>{wine.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/wines/${wine._id}/edit`} className="text-amber-600 hover:text-amber-500 text-sm mr-3">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
