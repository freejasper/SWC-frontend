import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducers } from '../store/producersSlice'

export default function ProducersPage() {
  const dispatch = useDispatch()
  const { list: producers, loading } = useSelector((state) => state.producers)

  useEffect(() => {
    dispatch(fetchProducers())
  }, [dispatch])

  if (loading) return <div className="text-center py-12 text-stone-500">Loading producers...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Our Producers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {producers.map((producer) => (
          <Link
            key={producer._id}
            to={`/producers/${producer._id}`}
            className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition group"
          >
            {producer.imageUrl && (
              <img
                src={producer.imageUrl}
                alt={producer.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-stone-900 group-hover:text-amber-600 transition">
                {producer.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
