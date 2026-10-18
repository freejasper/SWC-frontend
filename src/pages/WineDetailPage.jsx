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
    const orderSection = orderRef.current;
    if (!orderSection) return;

    const footerH = document.querySelector('footer').getBoundingClientRect().height;
    orderSection.style.bottom = `${footerH}px`;
  },[wine]);

  // SET + & - TO SQUARE
  const addToOrderRef = useRef(null);
  const minusRef = useRef(null);
  const addRef = useRef(null);

  useLayoutEffect(() => {
    if (!addToOrderRef.current || !minusRef.current || !addRef.current) return;

    const buttonH = addToOrderRef.current.getBoundingClientRect().height;
    const setSize = (ele) => {
      ele.style.height = `${buttonH}px`;
      ele.style.width = `${buttonH}px`;
    };

    setSize(minusRef.current);
    setSize(addRef.current);
  }, [isMobile, wine]);

  //ADD ORDER BUTTON HEIGHT TO BOTTOM OF SCREEN
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !orderRef.current) return;

    const footerH = document.querySelector('footer').getBoundingClientRect().height;
    const padding = orderRef.current.getBoundingClientRect().height;
    containerRef.current.style.paddingBottom = `${padding + (footerH * 2)}px`;
  }, [wine]);

  //POSITION PRICE CORRECTLY ALWAYS
  


  if (loading || !wine) return <div className="text-center py-12 text-stone-500">Loading...</div>

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 mx-auto h-[100%] overflowY-scroll">
      <Link 
        to="/wines" 
        className="absolute text-offblack mb-6 inline-block font-semibold underline hover:text-red-secondary transition z-10">
          Back
      </Link>

      <div 
        ref={containerRef}
        className={`flex overflow-hidden flex-wrap items-center justify-center ${ isMobile ? 'flex-col' : 'flex-row h-full'}`}>
        <div className={`basis-1/2 align-end justify-end flex relative ${isMobile ? 'w-full pb-1' : ''}`}>
          <div
            className={`absolute top-[30%] left-[55%] shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-primary price price-active scale-[1.25]`}>
              <span className="text-offwhite text-lg font-semibold">${wine.price}</span>
          </div>
          {wine.imageUrl && (
            <img 
              src={wine.imageUrl} 
              alt={wine.name} 
              className={`object-cover ${isMobile ? 'w-full h-114' : 'h-140'}`} />
          )}
          {!wine.imageUrl && (
            <img 
              src='/wine_bottle.webp' 
              alt={wine.name} 
              className={`object-contain ${isMobile ? 'w-full h-114' : 'h-140'}`} />
          )}
        </div>

        <div className={`basis-1/2 flex flex-wrap content-start ${isMobile ? '' : 'pr-6'}`}>
          <div className={`${isMobile ? '' : 'basis-2/3'}`}>
            <h1 className="text-3xl font-semibold text-offwhite uppercase tracking-wider">{wine.name}</h1>
          </div>

          <div className={`basis-full noshrink`}>
            <Link to={`/producers/${wine.producer?._id}`} className="mt-1 text-offblack hover:text-red-secondary font-semibold text-base">
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
                <p className="text-offblack text-sm whitespace-pre-line text-justify">{wine.description}</p>
              </div>
            )}

            {wine.producer?.description && (
              <div className="mt-3 w-full">
                <p className="text-offblack text-sm whitespace-pre-line text-justify">{wine.producer.description}</p>
              </div>
            )}
          </div>
          
        </div>

        <div 
          ref={orderRef}
          className={`flex items-center justify-center fixed`}>
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
            <div className="flex flex-col items-center justify-center gap-1 w-full">
              <div className="flex gap-1 w-full items-center justify-center">
                <button
                  ref={minusRef}
                  onClick={() => {
                    setQuantity((prev) => {
                      const value = Math.max(1, Math.min(wine.stock, prev - 1));
                      return value;
                    })
                  }}
                  className="grow-0
                            text-center 
                            rounded-full bg-offwhite
                            font-semibold 
                            text-red-primary hover:text-offwhite hover:bg-red-secondary 
                            transition 
                            px-3 py-2">
                    -
                </button>
                <div className="flex items-center justify-center group rounded-full bg-offwhite hover:bg-red-secondary transition text-left px-3 py-2 grow-0 text-center">
                  <input
                    type="number"
                    min="1"
                    max={wine.stock}
                    value={quantity}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(wine.stock, Number(e.target.value)))
                      setQuantity(value)
                    }}
                    className="inline-block 
                              text-red-primary 
                              group-hover:text-offwhite font-semibold 
                              focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                              text-center"
                  />
                </div>
                <button
                  ref={addRef}
                  onClick={() => {
                    setQuantity((prev) => {
                      const value = Math.max(1, Math.min(wine.stock, prev + 1));
                      return value;
                    })
                  }}
                  className="grow-0 
                            rounded-full bg-offwhite
                            font-semibold text-red-primary hover:text-offwhite hover:bg-red-secondary 
                            transition 
                            px-3 py-2">
                    +
                </button>
              </div>
              <button
                ref={addToOrderRef}
                onClick={handleAddToCart}
                className="rounded-full grow
                          bg-offwhite
                          font-semibold text-red-primary hover:text-offwhite hover:bg-red-secondary
                          transition text-center
                          px-3 py-2
                          w-full">
                Add to Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
