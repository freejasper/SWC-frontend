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
    <div className="px-4 sm:px-6 lg:px-8 flex flex-col flex-1 h-full">
      <h1 className="text-4xl font-bold uppercase">Producers</h1>
      
      <div className="flex flex-col gap-6 py-6 mt-auto mb-6">
        {producers.map((producer) => (
          <Link
            key={producer._id}
            to={`/producers/${producer._id}`}
            className="overflow-hidden transition group border-b-2 border-offblack
                        group hover:border-offwhite transition"
          >
            {producer.imageUrl && (
              <img
                src={producer.imageUrl}
                alt={producer.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold group-hover:text-offwhite">
                {producer.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}