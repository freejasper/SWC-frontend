import { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../utilities/useWindowWidth'

export default function WineCardScroller({ wines, user }) {
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < 768
  const [activeIndex, setActiveIndex] = useState(0)
  const winesListRef = useRef(null)

  const mobileCardWidth = windowWidth * 0.4
  const desktopCardWidth = 225

  const cardWidth = useMemo(() => {
    if (isMobile) return mobileCardWidth
    return desktopCardWidth
  }, [isMobile, mobileCardWidth, desktopCardWidth])

  useEffect(() => {
    const container = winesListRef.current
    if (!container) return

    const marginX = (windowWidth - cardWidth) / 2

    const observerOptions = {
      root: container,
      rootMargin: `0px -${marginX}px -0px -${marginX}px`,
      threshold: 0.5,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10)
          if (!isNaN(index)) {
            setActiveIndex(index)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const children = container.querySelectorAll('.wine-card-target')
    children.forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [wines, isMobile, windowWidth, cardWidth])

  const spacerWidth = useMemo(() => {
    return (windowWidth / 2) - (cardWidth / 2)
  }, [windowWidth, cardWidth])

  useLayoutEffect(() => {
    const paddingSize = 60

    const resizeChildren = () => {
      const winesSection = winesListRef.current
      if (!winesSection) return

      const winesSectionH = winesSection.getBoundingClientRect().height

      const children = Array.from(winesSection.querySelectorAll('.wine-card-target'))
      if (children.length === 0) return

      let maxDetailsHeight = 0
      children.forEach((child) => {
        const details = child.querySelector('.wine-details')
        if (!details) return

        const detailsHeight = details.getBoundingClientRect().height
        if (detailsHeight > maxDetailsHeight) {
          maxDetailsHeight = detailsHeight
        }
      })

      children.forEach((child) => {
        const image = child.querySelector('img')
        const details = child.querySelector('.wine-details')

        if (!image || !details) return

        if (!isMobile) image.style.height = `${winesSectionH - maxDetailsHeight - paddingSize}px`
        if (isMobile) image.style.height = `${winesSectionH - maxDetailsHeight - (paddingSize * 2)}px`
        child.style.transform = `translateY(-${(maxDetailsHeight / 2 + 5)}px)`
      })
    }

    window.addEventListener('resize', resizeChildren)
    resizeChildren()

    return () => {
      window.removeEventListener('resize', resizeChildren)
    };
  }, [wines, isMobile])

  const wineDesktopListStyles = {
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    alignItems: 'center',
  }

  const wineMobileListStyles = {
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    alignItems: 'center',
  }

  const priceActive = {
    opacity: '1',
    transform: 'scale(1.3)',
    left: isMobile ? `${mobileCardWidth / 2 + 10}px` : `${desktopCardWidth / 2 + 10}px`,
    top: '25%'
  }

  const wineDetailsPosition = {
    width: '100vw',
    left: `calc(-50vw + ${cardWidth / 2}px)`,
  }

  const wheelScroll = (e) => {
    const isOverWines = winesListRef.current && winesListRef.current.contains(e.target)
    if (!isOverWines) return

    e.preventDefault()

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const scrollVal = e.deltaY > 20 ? 20 : e.deltaY < -20 ? -20 : e.deltaY
      winesListRef.current.scrollLeft += scrollVal
    } else {
      const scrollVal = e.deltaX > 20 ? 20 : e.deltaX < -20 ? -20 : e.deltaX
      winesListRef.current.scrollLeft += scrollVal
    }
  }

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('wheel', wheelScroll, { passive: false })
    }
    return () => {
      if (!isMobile) window.removeEventListener('wheel', wheelScroll, { passive: false })
    }
  }, [isMobile])

  return (
    <div
      className="max-h-[100dvh] h-[100%] scrollbar-thin transition-opacity duration-800"
      ref={winesListRef}
      style={isMobile ? wineMobileListStyles : wineDesktopListStyles}
    >
      <div style={{ flex: `0 0 ${spacerWidth}px`, flexShrink: 0 }}></div>
      {wines.map((wine, index) => {
        const isActive = index === activeIndex

        return (
          <Link
            key={wine._id}
            to={`/wines/${wine._id}`}
            data-index={index}
            className="transition-all duration-300 ease-out group relative wine-card-target"
            style={{
              flex: `0 0 ${cardWidth}px`,
              scrollSnapAlign: 'center',
              display: 'inline-block',
              zIndex: isActive ? '10' : '1',
            }}>
            <div className="relative">
              <div
                className={`flex items-center justify-center 
                  absolute w-12 h-12 
                  rounded-full 
                  bg-blue-primary price
                  ${isActive ? 'z-11' : 'z-1'}`}
                style={isActive ? priceActive : null}>
                <span className="text-offwhite text-lg font-semibold">${wine.price}</span>
              </div>
              {wine.imageUrl && (
                <img 
                  src={wine.imageUrl} 
                  alt={wine.name} 
                  className={` 
                    object-cover
                    ${isActive ? 'scale-100' : 'scale-60'}
                    transition`} />
              )}
              {!wine.imageUrl && (
                <img 
                  src='/wine_bottle.webp' 
                  alt={wine.name} 
                  className={`w-full 
                    object-cover
                    ${isActive ? 'scale-100' : 'scale-60'}
                    transition`} />
              )}
              <div className={`wine-details flex items-center flex-wrap absolute pt-2 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                style={wineDetailsPosition}>
                <h3 className="text-2xl text-offwhite uppercase transition w-full text-center tracking-wider leading-none">
                  {wine.name}
                </h3>
                <p className="text-offblack font-semibold text-base mt-1 w-full text-center">{wine.producer?.name}</p>
                 <div className="flex items-center w-full items-center justify-center">
                  {Array.isArray(wine.varietal) && wine.varietal.map((variety, idx) => (
                    <span key={idx} className="text-xs font-light py-0.5">
                      {variety.name}{idx < wine.varietal.length - 1 ? '-' : ''}
                    </span>
                  ))}
                  <span className="text-xs font-light py-0.5">
                    &nbsp;/ {wine.colour?.name} / 
                  </span>
                  <span className="text-xs font-light py-0.5">
                    &nbsp;{wine.region?.name}
                  </span>
                </div>
                {user && 
                  <div>
                    {user.role === 'admin' &&
                      <span className="">
                        {wine.stock > 0 ? `${wine.stock}` : 'Out of stock'}
                      </span>
                    }
                    {user.role !== 'admin' &&
                      <span className="">
                        {wine.stock > 0 ? null : 'Out of stock'}
                      </span>
                    }
                  </div>
                } 
              </div>
            </div>
          </Link>
        )
      })}
      <div style={{ flex: `0 0 ${spacerWidth}px`, flexShrink: 0 }}></div>
    </div>
  )
}
