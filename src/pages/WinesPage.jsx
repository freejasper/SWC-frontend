import { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWines } from '../store/winesSlice'
import { fetchProducers } from '../store/producersSlice'
import { fetchRegions, fetchVarietals, fetchColours } from '../store/tagsSlice'
import { useWindowWidth } from '../utilities/useWindowWidth';

export default function WinesPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { list: wines, loading } = useSelector((state) => state.wines)
  const { list: producers } = useSelector((state) => state.producers)
  const { regions, varietals, colours } = useSelector((state) => state.tags)
  const { user } = useSelector((state) => state.auth)

  const filters = {
    producer: searchParams.get('producer') || '',
    region: searchParams.get('region') || '',
    varietal: searchParams.get('varietal') || '',
    colour: searchParams.get('colour') || ''
  }

  useEffect(() => {
    dispatch(fetchProducers())
    dispatch(fetchRegions())
    dispatch(fetchVarietals())
    dispatch(fetchColours())
  }, [dispatch])  

  useEffect(() => {
    const params = {}
    if (filters.producer) params.producer = filters.producer
    if (filters.region) params.region = filters.region
    if (filters.varietal) params.varietal = filters.varietal
    if (filters.colour) params.colour = filters.colour

    dispatch(fetchWines(params))
  }, [dispatch, searchParams, filters.producer, filters.region, filters.varietal, filters.colour])

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) newParams.set(key, value)
    else newParams.delete(key)
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasFilters = Object.values(filters).some(Boolean)

  const [showFilters, setShowFilters] = useState('grid-closed');

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  const wineFiltersRef = useRef(null);
  const asideRef = useRef(null);
  const winesListRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const scrollVal = e.deltaY > 20 ? 20 : e.deltaY < -20 ? -20 : e.deltaY;
        winesListRef.current.scrollLeft += scrollVal;
      } else {
        const scrollVal = e.deltaX > 20 ? 20 : e.deltaX < -20 ? -20 : e.deltaX;
        winesListRef.current.scrollLeft += scrollVal;
      }
    };

    if (!isMobile) window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (!isMobile) window.removeEventListener('wheel', handleWheel, { passive: false });
    }
  },[showFilters, isMobile]);


  // FILTER OPEN/CLOSE ANIMATION
  const filterIconRef = useRef(null);

  const handleFilterClick = () => {
    if (showFilters === 'grid-closed') {
      setShowFilters('grid-open');
      if (filterIconRef.current) {
        filterIconRef.current.classList.add('filter-icon-open');
      }
    } else {
      setShowFilters('grid-closed');
      if (filterIconRef.current) {
        filterIconRef.current.classList.remove('filter-icon-open');
      }
    }
  }

  // WINE CARDS WIDTHS
  const mobileCardWidth = windowWidth * 0.4;
  const desktopCardWidth = 225;

  const cardWidth = useMemo(() => {
    if (isMobile) return mobileCardWidth;
    return desktopCardWidth;
  },[isMobile, mobileCardWidth, desktopCardWidth]);


  // SETTING ACTIVE CARD
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = winesListRef.current;
    if (!winesListRef.current) return;
    
    const marginX = (windowWidth - cardWidth) / 2;

    const observerOptions = {
      root: container,
      rootMargin: `0px -${marginX}px -0px -${marginX}px`,
      threshold: 0.5, 
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(index)) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const children = winesListRef.current.querySelectorAll('.wine-card-target');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [wines, isMobile, windowWidth, cardWidth]);

  const spacerWidth = useMemo(() => {
    return (windowWidth / 2) - (cardWidth / 2);
  }, [windowWidth, cardWidth]);

  // SET WINES LIST CONTAINER TO REMAINING VERTICAL SPACE
  const titleRef = useRef(null);
  const winesContListRef = useRef(null);

  useLayoutEffect(() => {
    const header = document.querySelector('header');
    const title = titleRef.current;
    const winesContList = winesContListRef.current;

    if (!header || !title || !winesContList) return;

    const handleResize = () => {
      const headerH = header.getBoundingClientRect().height;
      const titleH = title.getBoundingClientRect().height;

      const remainingHeight = window.innerHeight - (headerH + titleH);

      winesContList.style.height = `${remainingHeight}px`;
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // SETTING SIZE OF WINE CARDS
  useLayoutEffect(() => {
    const paddingSize = 60;

    const resizeChildren = () => {
      const winesSection = winesListRef.current;
      if (!winesSection) return;

      const winesSectionH = winesSection.getBoundingClientRect().height;

      const children = Array.from(winesSection.querySelectorAll('.wine-card-target'));
      if (children.length === 0) return;

      let maxDetailsHeight = 0;
      children.forEach((child) => {
        const details = child.querySelector('.wine-details');
        if (!details) return;

        const detailsHeight = details.getBoundingClientRect().height;
        if (detailsHeight > maxDetailsHeight) {
          maxDetailsHeight = detailsHeight;
        }
      });

      children.forEach((child) => {
        const image = child.querySelector('img');
        const details = child.querySelector('.wine-details');

        if (!image || !details) return;

        if (!isMobile) image.style.height = `${winesSectionH - maxDetailsHeight - paddingSize}px`;
        if (isMobile) image.style.height = `${winesSectionH - maxDetailsHeight - (paddingSize * 2)}px`;
        child.style.transform = `translateY(-${(maxDetailsHeight / 2 + 5)}px)`;
      });
    }

    window.addEventListener('resize', resizeChildren);
    resizeChildren();

    return () => {
      window.removeEventListener('resize', resizeChildren);
    };
  }, [wines, isMobile]);

  // STYLE OBJECTS
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
  };

  const wineDetailsPosition = {
    width: '100vw',
    left: `calc(-50vw + ${cardWidth / 2}px)`,
  }

  const filterButtonStyles = 'rounded-full bg-offwhite text-red-primary hover:text-offwhite hover:bg-red-secondary transition inline-block px-3 py-2 text-left font-semibold';

  return (
    <div className="h-[100%] content-start">
      <div 
        ref={titleRef}
        className="w-full">
        <h1 className="px-4 sm:px-6 lg:px-8 text-4xl font-bold uppercase">Our Wines</h1>
      </div>

      <aside 
      ref={asideRef}
      className="w-full fixed shrink-0 px-4 sm:px-6 lg:px-8 z-20 pt-3">
        <div className="flex flex-wrap gap-4 pb-4 items-baseline">
          <button
            className="zero-style-button filter-button hover:text-red-secondary transition"
            onClick={handleFilterClick} >
              <div className="button-text">Filters</div>
              <div ref={filterIconRef} className="filter-icon">+</div>
          </button>
          {hasFilters && (
          <>
            <div className="flex gap-1 m-0 p-0">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null
                let filterVal = '';
                if (key === 'producer') filterVal = producers.find((p) => p._id === value);
                if (key === 'region') filterVal = regions.find((r) => r._id === value);
                if (key === 'varietal') filterVal = varietals.find((v) => v._id === value);
                if (key === 'colour') filterVal = colours.find((c) => c._id === value);
                if (filterVal) {
                  return (
                    <div
                      key={key}
                      className="leading-none h-fit m-0 p-0 font-light text-xs">
                        / {filterVal.name}
                    </div>
                  )
                }
                return null
              })}
            </div>
            <button
                onClick={clearFilters}
                className="zero-style-button button-text"
                >
            Clear Filters</button>
          </>
          )}
        </div>
        <div
          id="outer-wine-filters"
          className={`grid ${showFilters} box-border ${isMobile ? '' : 'max-w-1/3'}`}>
          <div
            id="inner-wine-filters" 
            className="overflow-hidden">
            <div
              className="flex gap-2 flex-wrap">

                <form 
                  className="text-sm m-0 min-w-26 flex flex-col gap-1" >
                    <div
                      className="w-full text-offblack uppercase font-semibold text-xs">
                      Producers
                    </div>
                    <div
                      className='flex flex-wrap gap-1'>
                      {producers.map((p) => (
                        <label 
                          key={p._id}
                          className={`cursor-pointer ${filterButtonStyles}`}>
                            <input
                                type="checkbox"
                                name="producer" 
                                value={p._id}
                                checked={filters.producer === p._id}
                                onChange={(e) => updateFilter('producer', e.target.checked ? e.target.value : '')}
                                className={`${filters.producer === p._id ? 'opacity-100' : 'opacity-0'} w-0`}
                                />
                            <span>
                              {p.name}
                            </span>
                        </label>
                    ))}
                    </div>
                </form>

                <form 
                  className="w-full text-sm m-0 min-w-26 flex flex-col gap-1 pb-1" >
                    <div
                      className="w-full text-offblack uppercase font-semibold text-xs">
                      Regions
                    </div>
                    <div
                      className='flex flex-wrap gap-1'>
                      {regions.map((r) => (
                          <label
                              key={r._id}
                              className={`cursor-pointer ${filterButtonStyles}`}>
                              <input 
                                  type="checkbox" 
                                  value={r._id}
                                  name="region"
                                  checked={filters.region === r._id}
                                  onChange={(e) => updateFilter('region', e.target.checked ? e.target.value : '')}
                                  className={`${filters.region === r._id ? 'opacity-100' : 'opacity-0'} w-0`}
                                  />
                              <span>
                                {r.name}
                              </span>
                          </label>
                      ))}
                      </div>
                </form>

                <form 
                  className="text-sm m-0 min-w-26 flex flex-col gap-1 pb-1" >
                  <div
                    className="text-offblack uppercase font-semibold text-xs">
                    Varietals
                  </div>
                  <div
                    className='flex flex-wrap gap-1'>
                    {varietals.map((v) => (
                        <label 
                            key={v._id}
                            className={`cursor-pointer ${filterButtonStyles}`}>
                            <input 
                                type="checkbox"
                                name="varietal"
                                value={v._id}
                                checked={filters.varietal === v._id}
                                onChange={(e) => updateFilter('varietal', e.target.checked ? e.target.value : '')}
                                className={`${filters.varietal === v._id ? 'opacity-100' : 'opacity-0'} w-0`}
                                />
                            <span>
                              {v.name}
                            </span>
                        </label>
                    ))}
                    </div>
                </form>

                <form 
                  className="text-sm m-0 min-w-26 flex flex-col gap-1 pb-1">
                  <div
                    className="text-offblack uppercase font-semibold text-xs">
                    Colours
                  </div>
                  <div
                    className='flex flex-wrap gap-1'>
                    {colours.map((c) => (
                        <label 
                          key={c._id}
                          className={`cursor-pointer ${filterButtonStyles}`}>
                            <input
                                type="checkbox"
                                name="colour"
                                value={c._id}
                                checked={filters.colour === c._id}
                                onChange={(e) => updateFilter('colour', e.target.checked ? e.target.value : '')}
                                className={`${filters.colour === c._id ? 'opacity-100' : 'opacity-0'} w-0`}
                                /> 
                            <span>
                              {c.name}
                            </span>
                        </label>
                    ))}
                    </div>
                </form>

            </div>
          </div>
          <div
            ref={wineFiltersRef}
            className="w-0 h-0 m-0 p-0"></div>
        </div>
      </aside>

      <div 
        ref={winesContListRef}
        className="flex-1 w-full items-center overflow-y-hidden">
        {loading ? (
          <div className="text-center py-12 text-offwhite">Loading wines...</div>
        ) : wines.length === 0 ? (
          <div className="text-center py-12 text-offwhite">No wines match your filters.</div>
        ) : (
          <div 
            className="max-h-[100dvh] h-[100%] scrollbar-thin transition-opacity duration-800"
            ref={winesListRef}
            style={isMobile ? wineMobileListStyles : wineDesktopListStyles}>
            <div style={{ flex: `0 0 ${spacerWidth}px`, flexShrink: 0 }}></div>
            {wines.map((wine, index) => {
              const isActive = index === activeIndex;

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
        )}
      </div>
    </div>
  )
}
