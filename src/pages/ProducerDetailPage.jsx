import { useEffect, useLayoutEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducer } from '../store/producersSlice'
import { fetchWines } from '../store/winesSlice'
import WineCardScroller from '../components/WineCardScroller'

export default function ProducerDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: producer, loading } = useSelector((state) => state.producers)
  const { list: wines, loading: winesLoading } = useSelector((state) => state.wines)
  const { user } = useSelector((state) => state.auth)

  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const headingRef = useRef(null)
  const winesContListRef = useRef(null)

  useEffect(() => {
    dispatch(fetchProducer(id))
    dispatch(fetchWines({ producer: id }))
  }, [dispatch, id])

  useLayoutEffect(() => {
    const header = document.querySelector('header')
    const winesContList = winesContListRef.current

    if (!header || !winesContList) return

    const handleResize = () => {
      const headerH = header.getBoundingClientRect().height
      const imageH = imageRef.current ? imageRef.current.getBoundingClientRect().height : 0
      const titleH = titleRef.current ? titleRef.current.getBoundingClientRect().height : 0
      const descH = descRef.current ? descRef.current.getBoundingClientRect().height : 0
      const headingH = headingRef.current ? headingRef.current.getBoundingClientRect().height : 0
      const marginBuffer = 64

      const remainingHeight = window.innerHeight - headerH - imageH - titleH - descH - headingH - marginBuffer

      if (remainingHeight > 600) {
        winesContList.style.height = `${remainingHeight}px`;
      } else {
        winesContList.style.height = '600px';
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [wines])

  if (loading || winesLoading || !producer) return <div className="text-center py-12 text-stone-500">Loading...</div>

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="text-offblack mb-6 inline-block font-semibold underline hover:text-red-secondary transition z-10">
          Back
        </button>
        {producer.imageUrl && (
          <img ref={imageRef} src={producer.imageUrl} alt={producer.name} className="w-full h-64 object-cover rounded-lg mb-8" />
        )}
        <h1 ref={titleRef} className="text-3xl font-bold text-stone-900 mb-4">{producer.name}</h1>
        <p ref={descRef} className="text-offblack whitespace-pre-line mb-8 w-2/3">{producer.description}</p>

        <h2 ref={headingRef} className="text-xl font-semibold text-offblack mb-4">Wines</h2>
      </div>
      <div ref={winesContListRef} className="flex-1 w-full items-center overflow-y-hidden">
          {wines.length === 0 && (
            <div className="text-center py-12 text-offwhite">No wines from this producer.</div>
          )}
          {wines.length > 0 && <WineCardScroller wines={wines} user={user} />}
      </div>
    </>
  )
}
