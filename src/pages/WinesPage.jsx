import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWines } from '../store/winesSlice'
import { fetchProducers } from '../store/producersSlice'
import { fetchRegions, fetchVarietals, fetchColours } from '../store/tagsSlice'

export default function WinesPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { list: wines, loading } = useSelector((state) => state.wines)
  const { list: producers } = useSelector((state) => state.producers)
  const { regions, varietals, colours } = useSelector((state) => state.tags)

  const filters = {
    region: searchParams.get('region') || '',
    varietal: searchParams.get('varietal') || '',
    colour: searchParams.get('colour') || '',
    producer: searchParams.get('producer') || '',
  }

  useEffect(() => {
    dispatch(fetchProducers())
    dispatch(fetchRegions())
    dispatch(fetchVarietals())
    dispatch(fetchColours())
  }, [dispatch])

  useEffect(() => {
    const params = {}
    if (filters.region) params.region = filters.region
    if (filters.varietal) params.varietal = filters.varietal
    if (filters.colour) params.colour = filters.colour
    if (filters.producer) params.producer = filters.producer

    dispatch(fetchWines(params))
  }, [dispatch, searchParams])

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

  return (
    <div className="flex flex-wrap gap-5">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-stone-900">Our Wines</h1>
      </div>
      <aside className="w-full shrink-0">
        <h2 className="text-lg font-semibold text-stone-900">Filters</h2>

        <div className="space-y-4 flex gap-2">
          <div>
            <select
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Regions</option>
              {regions.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.varietal}
              onChange={(e) => updateFilter('varietal', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Varietals</option>
              {varietals.map((v) => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.colour}
              onChange={(e) => updateFilter('colour', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Colours</option>
              {colours.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.producer}
              onChange={(e) => updateFilter('producer', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Producers</option>
              {producers.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="w-full bg-stone-200 text-stone-700 rounded px-3 py-2 text-sm hover:bg-stone-300 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1">
        {loading ? (
          <div className="text-center py-12 text-stone-500">Loading wines...</div>
        ) : wines.length === 0 ? (
          <div className="text-center py-12 text-stone-500">No wines match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wines.map((wine) => (
              <Link
                key={wine._id}
                to={`/wines/${wine._id}`}
                className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition group"
              >
                {wine.imageUrl && (
                  <img src={wine.imageUrl} alt={wine.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-600 transition">
                    {wine.name}
                  </h3>
                  <p className="text-stone-500 text-sm mt-1">{wine.producer?.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-stone-100 px-2 py-0.5 rounded">{wine.varietal?.name}</span>
                    <span className="text-xs bg-stone-100 px-2 py-0.5 rounded">{wine.colour?.name}</span>
                    <span className="text-xs bg-stone-100 px-2 py-0.5 rounded">{wine.region?.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-amber-600 font-bold text-lg">${wine.price}</span>
                    <span className={`text-xs ${wine.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {wine.stock > 0 ? `${wine.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
