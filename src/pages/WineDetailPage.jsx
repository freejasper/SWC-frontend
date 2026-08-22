import { useEffect, useLayoutEffect, useState, useRef } from 'react'
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

  //Fill remaining screen space

  //SET ADD TO ORDER BOTTOM SLIGHTLY ABOVE COPYRIGHT
  const orderRef = useRef(null);

  useLayoutEffect(() => {
    if (!isMobile) return;

    const orderSection = orderRef.current;
    if (!orderSection) return;

    const footerH = document.querySelector('footer').getBoundingClientRect().height;
    orderSection.style.bottom = `${footerH + 5}px`;
  },[isMobile, wine]);


  if (loading || !wine) return <div className="text-center py-12 text-stone-500">Loading...</div>

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 mx-auto h-[100%] overflowY-scroll">
      <Link 
        to="/wines" 
        className="absolute text-offblack mb-6 inline-block font-semibold underline hover:text-red-secondary transition z-10">
          Back
      </Link>

      <div className={`flex overflow-hidden flex-wrap items-center justify-center ${ isMobile ? 'flex-col' : 'flex-row'}`}>
        <div className="basis-1/3 align-center justify-center flex relative">
          <div
            className={`absolute top-[30%] ml-[15%] shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-primary price price-active scale-[1.25]`}>
              <span className="text-offwhite text-lg font-semibold">${wine.price}</span>
          </div>
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

        <div className="basis-2/3 flex flex-wrap content-start">
          <div className={`${isMobile ? '' : 'basis-2/3'}`}>
            <h1 className="text-3xl font-bold text-offwhite mb-2 uppercase tracking-wider">{wine.name}</h1>
          </div>

          <div className={`basis-full noshrink`}>
            <Link to={`/producers/${wine.producer?._id}`} className="mt-2 text-offblack hover:text-red-secondary font-semibold text-base">
              {wine.producer?.name}
            </Link>

            <div className="flex flex-wrap">
              {Array.isArray(wine.varietal) && wine.varietal.map((variety, idx) => (
                <span key={idx} className="text-sm py-1">{variety.name}{idx < wine.varietal.length - 1 ? '-' : ''}</span>
              ))}
              {!Array.isArray(wine.varietal) && 
                <span className="text-sm py-1">{wine.varietal?.name}</span>
              }
              <span className="text-sm py-1">&nbsp;/&nbsp;{wine.colour?.name}</span>
              <span className="text-sm py-1">&nbsp;/&nbsp;{wine.region?.name}</span>
            </div>
          </div>
          
          <div className={`${isMobile ? 'order-4' : ''} basis-full`}>
            {wine.description && (
              <div className="mt-3 w-full">
                <h3 className="font-semibold text-stone-900 mb-2">Description</h3>
                <p className="text-stone-600 whitespace-pre-line">{wine.description}</p>
              </div>
            )}

            {wine.producer?.description && (
              <div className="mt-3 w-full">
                <p className="text-offblack text-sm whitespace-pre-line">{wine.producer.description}</p>
              </div>
            )}
          </div>
          
        </div>

        <div 
          ref={orderRef}
          className={`flex items-center justify-center pl-4 ${isMobile ? 'fixed' : ''}`}>
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

          {wine.stock > 0 && (
            <div className="flex items-center">
              <button
                onClick={handleAddToCart}
                className="bg-transparent text-offblack px-1 py-2 font-semibold tracking-close hover:text-red-secondary transition"
              >
                Add to Order
              </button>
              <div className="flex items-center rounded">
                <input
                  type="number"
                  min="1"
                  max={wine.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(wine.stock, Number(e.target.value)))
                    setQuantity(value)
                  }}
                  className="text-center py-2 pr-1 bg-transparent text-offblack font-semibold skew-x-0 focus:outline-none focus:skew-x-[-12deg] hover:text-red-secondary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
