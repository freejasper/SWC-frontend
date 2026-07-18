import { useEffect, useState, useRef, useMemo } from 'react'
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
    const winesList = winesListRef.current ? winesListRef.current : null;
    const main = document.querySelector('main');

    const toggleFilters = () => {
      if (showFilters === 'grid-open') setShowFilters('grid-closed');
      if (filterIconRef.current) {
        filterIconRef.current.classList.remove('filter-icon-open');
      }
    }

    const handleWindowScroll = () => {
      const wineFilters = wineFiltersRef.current.getBoundingClientRect();
      const asideHeight = asideRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight || document.documentElement.clientHeight;

      if (asideHeight.height > screenHeight - 300) {
        if (wineFilters.top <= (screenHeight * 0.55)) {
          toggleFilters();
        }
      } else {
        toggleFilters();
      }

    }
    main.addEventListener('scroll', handleWindowScroll);
    winesList?.addEventListener('scroll', handleWindowScroll);
    return () => {
      main.removeEventListener('scroll', handleWindowScroll);
      winesList?.removeEventListener('scroll', handleWindowScroll);
    }
  },[showFilters, isMobile]);

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

  const [activeIndex, setActiveIndex] = useState(0);
  const mobileCardWidth = 125;
  const desktopCardWidth = 275;

  const cardWidth = useMemo(() => {
    if (isMobile) return mobileCardWidth;
    return desktopCardWidth;
  },[isMobile])

  useEffect(() => {
    if (!winesListRef.current) return;
    
    const marginX = (windowWidth - cardWidth) / 2;

    const observerOptions = {
      root: winesListRef.current,
      rootMargin: `0px -${marginX}px -0px -${marginX}px`,
      threshold: 0.1, 
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

  const pricePosition = useMemo(() => {
    if (isMobile) return 'left-[65px] top-[25%]';
    return 'left-[145px] top-[25%]';
  }, [isMobile]);

  const spacerWidth = useMemo(() => {
    return (windowWidth / 2) - (cardWidth / 2);
  }, [windowWidth, cardWidth]);

  const winePaddingSize = {
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    alignItems: 'top',
  }

  const priceActive = {
    opacity: '1',
    transform: 'scale(1)',
  };

  const wineDetailsPosition = {
    width: '100vw',
    left: `calc(-50vw + ${cardWidth / 2}px)`,
  }

  return (
    <div className="flex flex-wrap gap-2 h-full">
      <div className="w-full">
        <h1 className="text-5xl font-bold invisible h-0">Our Wines</h1>
      </div>

      <aside 
      ref={asideRef}
      className="w-full shrink-0 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 pb-4 items-baseline">
          <button 
            className="zero-style-button filter-button"
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
                className="zero-style-button"
                >
            Clear Filters</button>
          </>
          )}
        </div>
        <div
          id="outer-wine-filters"
          className={`grid ${showFilters} box-border`}>
          <div
            id="inner-wine-filters" 
            className="overflow-hidden">
            <div
              className="flex gap-2 flex-wrap">

                <form 
                  className="w-full text-sm m-0 min-w-26 flex flex-col gap-1 pb-1" >
                    <div
                      className="w-full pb-1 border-b border-offwhite text-offwhite uppercase font-semibold tracking-wider text-xs">
                      Producers
                    </div>
                    <div
                      className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                      {producers.map((p) => (
                        <label 
                          key={p._id}
                          className="flex items-center gap-1 grow cursor-pointer">
                            <input
                                type="checkbox"
                                name="producer" 
                                value={p._id}
                                checked={filters.producer === p._id}
                                onChange={(e) => updateFilter('producer', e.target.checked ? e.target.value : '')}
                                className={filters.producer === p._id ? 'opacity-100' : 'opacity-0'}
                                />
                            <span
                              className="">
                              {p.name}
                            </span>
                        </label>
                    ))}
                    </div>
                </form>

                <form 
                  className="w-full text-sm m-0 min-w-26 flex flex-col gap-1 pb-1" >
                    <div
                      className="w-full pb-1 border-b border-offwhite text-offwhite uppercase font-semibold tracking-wider text-xs">
                      Regions
                    </div>
                    <div
                      className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                      {regions.map((r) => (
                          <label
                              key={r._id}
                              className="flex items-center gap-1 grow cursor-pointer">
                              <input 
                                  type="checkbox" 
                                  value={r._id}
                                  name="region"
                                  checked={filters.region === r._id}
                                  onChange={(e) => updateFilter('region', e.target.checked ? e.target.value : '')}
                                  className={filters.region === r._id ? 'opacity-100' : 'opacity-0'}
                                  />
                              <span
                                className="">
                                {r.name}
                              </span>
                          </label>
                      ))}
                      </div>
                </form>

                <form 
                  className="w-full text-sm m-0 min-w-26 flex flex-col gap-1 pb-1" >
                  <div
                    className="w-full pb-1 border-b border-offwhite text-offwhite uppercase font-semibold tracking-wider text-xs">
                    Varietals
                  </div>
                  <div
                    className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                    {varietals.map((v) => (
                        <label 
                            key={v._id}
                            className="flex items-center gap-1 grow cursor-pointer">
                            <input 
                                type="checkbox"
                                name="varietal"
                                value={v._id}
                                checked={filters.varietal === v._id}
                                onChange={(e) => updateFilter('varietal', e.target.checked ? e.target.value : '')}
                                className={filters.varietal === v._id ? 'opacity-100' : 'opacity-0'}
                                />
                            <span
                              className="">
                              {v.name}
                            </span>
                        </label>
                    ))}
                    </div>
                </form>

                <form 
                  className="w-full text-sm m-0 min-w-26 flex flex-col gap-1 pb-1">
                  <div
                    className="w-full pb-1 border-b border-offwhite text-offwhite uppercase font-semibold tracking-wider text-xs">
                    Colours
                  </div>
                  <div
                    className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                    {colours.map((c) => (
                        <label 
                          key={c._id}
                          className="flex items-center gap-1 grow cursor-pointer">
                            <input
                                type="checkbox"
                                name="colour"
                                value={c._id}
                                checked={filters.colour === c._id}
                                onChange={(e) => updateFilter('colour', e.target.checked ? e.target.value : '')}
                                className={filters.colour === c._id ? 'opacity-100' : 'opacity-0'}
                                /> 
                            <span
                              className="">
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

      <div className="flex-1 w-full h-full">
        {loading ? (
          <div className="text-center py-12 text-offwhite">Loading wines...</div>
        ) : wines.length === 0 ? (
          <div className="text-center py-12 text-offwhite">No wines match your filters.</div>
        ) : (
          <div 
            className="max-h-[100dvh] h-[100%] scrollbar-thin"
            ref={winesListRef}
            style={winePaddingSize}>
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
                    transform: isActive ? 'scale(1)' : 'scale(0.6)',
                    zIndex: isActive ? '10' : '1',
                  }}>
                  <div className="relative">
                    <div
                      className={`flex items-center justify-center absolute w-12 h-12 rounded-full bg-blue-primary price ${pricePosition}`}
                      style={isActive ? priceActive : null}>
                        <span className="text-offwhite text-lg font-semibold">${wine.price}</span>
                    </div>
                    {wine.imageUrl && (
                      <img src={wine.imageUrl} alt={wine.name} className={`w-full ${isMobile ? 'h-54' :'h-94'} object-contain`} />
                    )}
                    {!wine.imageUrl && (
                      <img src='/wine_bottle.webp' alt={wine.name} className={`w-full ${isMobile ? 'h-54' :'h-94'} object-contain`} />
                    )}
                    <div className={`flex items-center flex-wrap absolute ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      style={wineDetailsPosition}>
                      <h3 className="text-2xl font-medium text-offwhite uppercase transition w-full text-center tracking-wider">
                        {wine.name}
                      </h3>
                      <p className="text-offblack font-semibold text-base mt-1 w-full text-center">{wine.producer?.name}</p>
                      <div className="flex items-center gap-2 w-full items-center justify-center">
                        <span className="text-xs font-light px-2 py-0.5">
                          {wine.varietal?.name} / {wine.colour?.name} / {wine.region?.name}
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
