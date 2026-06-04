import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProducer, createProducer, updateProducer } from '../../api/producerApi'
import toast from 'react-hot-toast'

export default function AdminProducerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getProducer(id).then((res) => {
        const p = res.data
        setForm({ name: p.name, description: p.description || '', imageUrl: p.imageUrl || '' })
      }).catch(() => toast.error('Failed to load producer'))
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await updateProducer(id, form)
        toast.success('Producer updated')
      } else {
        await createProducer(form)
        toast.success('Producer created')
      }
      navigate('/admin/producers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save producer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">{isEdit ? 'Edit Producer' : 'New Producer'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-stone-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5} className="w-full border border-stone-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
          <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full border border-stone-300 rounded px-3 py-2" placeholder="https://..." />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-500 transition disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Producer' : 'Create Producer'}
          </button>
          <button type="button" onClick={() => navigate('/admin/producers')}
            className="border border-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-medium hover:bg-stone-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
