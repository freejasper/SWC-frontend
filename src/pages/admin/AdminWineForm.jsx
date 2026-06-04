import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducers } from '../../store/producersSlice'
import { fetchRegions, fetchVarietals, fetchColours } from '../../store/tagsSlice'
import { getWine, createWine, updateWine } from '../../api/wineApi'
import toast from 'react-hot-toast'

export default function AdminWineForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isEdit = Boolean(id)

  const { list: producers } = useSelector((state) => state.producers)
  const { regions, varietals, colours } = useSelector((state) => state.tags)

  const [form, setForm] = useState({
    name: '', producer: '', region: '', varietal: '', colour: '',
    price: '', stock: '', imageUrl: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchProducers())
    dispatch(fetchRegions())
    dispatch(fetchVarietals())
    dispatch(fetchColours())
  }, [dispatch])

  useEffect(() => {
    if (isEdit) {
      getWine(id).then((res) => {
        const w = res.data
        setForm({
          name: w.name,
          producer: w.producer?._id || '',
          region: w.region?._id || '',
          varietal: w.varietal?._id || '',
          colour: w.colour?._id || '',
          price: w.price,
          stock: w.stock,
          imageUrl: w.imageUrl || '',
        })
      }).catch(() => toast.error('Failed to load wine'))
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = { ...form, price: Number(form.price), stock: Number(form.stock) }
      if (isEdit) {
        await updateWine(id, data)
        toast.success('Wine updated')
      } else {
        await createWine(data)
        toast.success('Wine created')
      }
      navigate('/admin/wines')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save wine')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">{isEdit ? 'Edit Wine' : 'New Wine'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-stone-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Producer</label>
          <select required value={form.producer} onChange={(e) => setForm({ ...form, producer: e.target.value })}
            className="w-full border border-stone-300 rounded px-3 py-2">
            <option value="">Select producer</option>
            {producers.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Region</label>
            <select required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2">
              <option value="">Select</option>
              {regions.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Varietal</label>
            <select required value={form.varietal} onChange={(e) => setForm({ ...form, varietal: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2">
              <option value="">Select</option>
              {varietals.map((v) => <option key={v._id} value={v._id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Colour</label>
            <select required value={form.colour} onChange={(e) => setForm({ ...form, colour: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2">
              <option value="">Select</option>
              {colours.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Price ($)</label>
            <input type="number" step="0.01" min="0" required value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
            <input type="number" min="0" required value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
          <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full border border-stone-300 rounded px-3 py-2" placeholder="https://..." />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-500 transition disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Wine' : 'Create Wine'}
          </button>
          <button type="button" onClick={() => navigate('/admin/wines')}
            className="border border-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-medium hover:bg-stone-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
