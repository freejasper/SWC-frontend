import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRegions, fetchVarietals, fetchColours } from '../../store/tagsSlice'
import { createRegion, createVarietal, createColour } from '../../api/tagApi'
import toast from 'react-hot-toast'

export default function AdminTags() {
  const dispatch = useDispatch()
  const { regions, varietals, colours } = useSelector((state) => state.tags)

  const [newRegion, setNewRegion] = useState('')
  const [newVarietal, setNewVarietal] = useState('')
  const [newColour, setNewColour] = useState('')

  useEffect(() => {
    dispatch(fetchRegions())
    dispatch(fetchVarietals())
    dispatch(fetchColours())
  }, [dispatch])

  const handleAddRegion = async (e) => {
    e.preventDefault()
    if (!newRegion.trim()) return
    try {
      await createRegion({ name: newRegion.trim() })
      toast.success('Region added')
      setNewRegion('')
      dispatch(fetchRegions())
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add region')
    }
  }

  const handleAddVarietal = async (e) => {
    e.preventDefault()
    if (!newVarietal.trim()) return
    try {
      await createVarietal({ name: newVarietal.trim() })
      toast.success('Varietal added')
      setNewVarietal('')
      dispatch(fetchVarietals())
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add varietal')
    }
  }

  const handleAddColour = async (e) => {
    e.preventDefault()
    if (!newColour.trim()) return
    try {
      await createColour({ name: newColour.trim() })
      toast.success('Colour added')
      setNewColour('')
      dispatch(fetchColours())
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add colour')
    }
  }

  const TagSection = ({ title, items, value, onChange, onSubmit, placeholder }) => (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {items.map((item) => (
          <span key={item._id} className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm">{item.name}</span>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} className="flex-1 border border-stone-300 rounded px-3 py-2 text-sm" />
        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-500 transition">
          Add
        </button>
      </form>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Manage Tags</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TagSection
          title="Regions"
          items={regions}
          value={newRegion}
          onChange={setNewRegion}
          onSubmit={handleAddRegion}
          placeholder="New region..."
        />
        <TagSection
          title="Varietals"
          items={varietals}
          value={newVarietal}
          onChange={setNewVarietal}
          onSubmit={handleAddVarietal}
          placeholder="New varietal..."
        />
        <TagSection
          title="Colours"
          items={colours}
          value={newColour}
          onChange={setNewColour}
          onSubmit={handleAddColour}
          placeholder="New colour..."
        />
      </div>
    </div>
  )
}
