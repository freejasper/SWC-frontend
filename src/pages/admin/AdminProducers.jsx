import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducers } from '../../store/producersSlice'

export default function AdminProducers() {
  const dispatch = useDispatch()
  const { list: producers, loading } = useSelector((state) => state.producers)

  useEffect(() => {
    dispatch(fetchProducers())
  }, [dispatch])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Producers</h1>
        <Link to="/admin/producers/new" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-500 transition">
          Add Producer
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
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {producers.map((producer) => (
                <tr key={producer._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-900">{producer.name}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/producers/${producer._id}/edit`} className="text-amber-600 hover:text-amber-500 text-sm">
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
