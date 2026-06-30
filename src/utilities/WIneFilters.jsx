import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWines } from '../store/winesSlice'
import { fetchProducers } from '../store/producersSlice'
import { fetchRegions, fetchVarietals, fetchColours } from '../store/tagsSlice'

export default function WineFilters() {
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
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


    // UPDATING DROPDOWNS TO RADIO LIST
    // MOBILE FRIENDLY

    return (
        <>
            <aside className="w-full shrink-0">
                <h2 className="font-semibold underline m-0 leading-none pb-1">Filters:</h2>
                <div className="flex gap-2 items-end">
                    <form>
                        <label>
                            <input
                                type="radio"
                                name="region"
                                value=""
                                onChange={(e) => updateFilter('region', e.target.value)}
                                className="w-full text-sm m-0 min-w-26"
                            />
                            <span>All Regions</span>
                        </label>
                        {regions.map((r) => (
                            <label
                                key={r._id}>
                                <input 
                                    type="radio" 
                                    value={r._id}
                                    name="region"
                                    onChange={(e) => updateFilter('region', e.target.value)}
                                    className="w-full text-sm m-0 min-w-26"
                                />
                                <span>{r.name}</span>
                            </label>
                        ))}
                    </form>

                    <form>
                        <label>
                            <input
                                type="radio"
                                name="varietal"
                                value=""
                                onChange={(e) => updateFilter('varietal', e.target.value)}
                                className="w-full text-sm m-0 min-w-26"
                                />
                            <span>All Varietals</span>
                        </label>
                        {varietals.map((v) => (
                            <label 
                                key={v._id}>
                                <input 
                                    type="radio"
                                    name="varietal"
                                    value={v._id}
                                    onChange={(e) => updateFilter('varietal', e.target.value)}
                                    className="w-full text-sm m-0 min-w-26" />
                                <span>{v.name}</span>
                            </label>
                        ))}
                    </form>

                    <form>
                        <label>
                            <input
                                type="radio"
                                name="colour"
                                value=""
                                onChange={(e) => updateFilter('colour', e.target.value)}
                                className="w-full text-sm m-0 min-w-26"
                                />
                            <span>All Colours</span>
                        </label>
                        {colours.map((c) => (
                            <label key={c._id}>
                                <input
                                    type="radio"
                                    name="colour"
                                    value={c._id}
                                    onChange={(e) => updateFilter('colour', e.target.value)}
                                    className="w-full text-sm m-0 min-w-26" /> 
                                <span>{c.name}</span>
                            </label>
                        ))}
                    </form>

                    <form>
                        <label>
                            <input
                                type="radio"
                                name="producer"
                                value=""
                                onChange={(e) => updateFilter('producer', e.target.value)}
                                className="w-full text-sm m-0 min-w-26" />
                            <span>All Producers</span>
                        </label>
                        {producers.map((p) => (
                            <label key={p._id}>
                                <input
                                    type="radio"
                                    name="producer" 
                                    value={p._id}
                                    onChange={(e) => updateFilter('producer', e.target.value)}
                                    className="w-full text-sm m-0 min-w-26" />
                                <span>{p.name}</span>
                            </label>
                        ))}
                    </form>
                    
                    <button
                        onClick={() => dispatch(fetchWines(filters))}
                        className=""
                    >
                        Apply Filters
                    </button>

                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="bg-stone-200 text-stone-700 rounded px-3 text-sm hover:bg-stone-300 transition"
                            >
                        Clear Filters</button>
                    )}
                </div>
            </aside>
        </>
    )
}