import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducer } from '../store/producersSlice'
import { fetchWines } from '../store/winesSlice'

export default function ProducerDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { current: producer, loading } = useSelector((state) => state.producers)
  const { list: wines } = useSelector((state) => state.wines)

  useEffect(() => {
    dispatch(fetchProducer(id))
    dispatch(fetchWines({ producer: id }))
  }, [dispatch, id])

  if (loading || !producer) return <div className="text-center py-12 text-stone-500">Loading...</div>

  const producerWines = wines.filter((w) => w.producer?._id === id)

  return (
    <div>
      {producer.imageUrl && (
        <img src={producer.imageUrl} alt={producer.name} className="w-full h-64 object-cover rounded-lg mb-8" />
      )}
      <h1 className="text-3xl font-bold text-stone-900 mb-4">{producer.name}</h1>
      <p className="text-stone-600 whitespace-pre-line mb-8">{producer.description}</p>

      <h2 className="text-2xl font-semibold text-stone-900 mb-4">Wines</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {producerWines.map((wine) => (
          <Link
            key={wine._id}
            to={`/wines/${wine._id}`}
            className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-stone-900">{wine.name}</h3>
            <p className="text-stone-500 text-sm">{wine.varietal?.name} &middot; {wine.colour?.name}</p>
            <p className="text-amber-600 font-bold mt-2">${wine.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
