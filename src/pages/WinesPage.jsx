import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWines } from '../store/winesSlice'
import { fetchProducers } from '../store/producersSlice'
import { fetchRegions, fetchVarietals, fetchColours } from '../store/tagsSlice'
import { useWindowWidth } from '../utilities/useWindowWidth';
import WineCardScroller from '../components/WineCardScroller'

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

  // STYLE OBJECTS
  const filterButtonStyles = 'rounded-full bg-offwhite text-red-primary hover:text-offwhite hover:bg-red-secondary transition inline-block px-3 py-2 text-left font-semibold';

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

  return (
    <div className="h-[100%] content-start">
      <div 
        ref={titleRef}
        className="w-full">
        <h1 className="px-4 sm:px-6 lg:px-8 text-4xl font-bold uppercase">Wines</h1>
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
          <WineCardScroller wines={wines} user={user} />
        )}
      </div>
    </div>
  )
}
