import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWine } from '../store/winesSlice'
import { addToCart } from '../store/cartSlice'
import toast from 'react-hot-toast'
import { useWindowWidth } from '../utilities/useWindowWidth'

export default function WineDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { current: wine, loading } = useSelector((state) => state.wines)
  const [quantity, setQuantity] = useState(1)
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchWine(id))
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (wine.stock === 0) {
      toast.error('This wine is out of stock')
      return
    }
    dispatch(addToCart({ wine, quantity }))
    toast.success(`Added ${quantity} × ${wine.name} to cart`)
  }

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  

  if (loading || !wine) return <div className="text-center py-12 text-stone-500">Loading...</div>

  return (
    <div className="px-4 sm:px-6 lg:px-8 mx-auto h-[100%] overflowY-scroll">
      <Link 
        to="/wines" 
        className="text-offblack mb-6 inline-block font-semibold underline basis-1/12">
          Back
      </Link>

      <div className={`flex overflow-hidden basis-11/12 ${ isMobile ? 'flex-col' : 'flex-row'}`}>
        <div className="basis-1/3">
          {wine.imageUrl && (
            <img src={wine.imageUrl} alt={wine.name} className="w-full h-80 object-cover" />
          )}
          {!wine.imageUrl && (
            <img 
              src='/wine_bottle.webp' 
              alt={wine.name} 
              className='w-full h-94 object-contain' />
          )}
        </div>

        <div className="p-8 basis-2/3">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">{wine.name}</h1>

          <Link to={`/producers/${wine.producer?._id}`} className="text-amber-600 hover:text-amber-500 font-medium">
            {wine.producer?.name}
          </Link>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm bg-stone-100 px-3 py-1 rounded-full">{wine.varietal?.name}</span>
            <span className="text-sm bg-stone-100 px-3 py-1 rounded-full">{wine.colour?.name}</span>
            <span className="text-sm bg-stone-100 px-3 py-1 rounded-full">{wine.region?.name}</span>
          </div>

          <div className="flex items-center justify-between mt-6 p-4 bg-stone-50 rounded-lg">
            <div>
              <span className="text-3xl font-bold text-amber-600">${wine.price}</span>
              {user &&
                <div>
                  {user.role === 'admin' &&
                    <p className={`text-sm mt-1 ${wine.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {wine.stock > 0 ? `${wine.stock} bottles available` : 'Currently out of stock'}
                    </p>
                  }
                  {user.role !== 'admin' &&
                    <p className={`text-sm mt-1 ${wine.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {wine.stock > 0 ? null : 'Currently out of stock'}
                    </p>
                  }
                </div>
              }
            </div>

            {wine.stock > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-stone-100 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(wine.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-stone-100 transition"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-500 transition"
                >
                  Add to Order
                </button>
              </div>
            )}
              </div>

          {wine.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-stone-900 mb-2">Description</h3>
              <p className="text-stone-600 whitespace-pre-line">{wine.description}</p>
            </div>
          )}

          {wine.producer?.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-stone-900 mb-2">About {wine.producer.name}</h3>
              <p className="text-stone-600 text-sm whitespace-pre-line">{wine.producer.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
