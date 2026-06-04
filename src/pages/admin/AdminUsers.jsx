import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUsers, createUser, deleteUser, getUserOrders } from '../../api/userApi'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const currentUser = useSelector((state) => state.auth.user)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [saving, setSaving] = useState(false)
  const [orders, setOrders] = useState(null)
  const [ordersLoading, setOrdersLoading] = useState(false)

  const loadUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password) return
    setSaving(true)
    try {
      await createUser(form)
      toast.success('User created')
      setForm({ name: '', email: '', password: '', role: 'user' })
      loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return
    try {
      await deleteUser(userId)
      toast.success('User deleted')
      if (orders && orders.some((o) => o.user?._id === userId)) setOrders(null)
      loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleViewOrders = async (userId) => {
    if (orders && orders[0]?.user?._id === userId) {
      setOrders(null)
      return
    }
    setOrdersLoading(true)
    setOrders(null)
    try {
      const res = await getUserOrders(userId)
      setOrders(res.data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Manage Users</h1>

      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Create User</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
            <input type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
            <input type="password" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-stone-600 mb-1">Role</label>
            <select value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={saving}
            className="bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-500 transition disabled:opacity-50">
            {saving ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-500">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-stone-500">No users found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Role</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Created</th>
                <th className="px-4 py-3 text-sm font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-900">{u.name}</td>
                  <td className="px-4 py-3 text-stone-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-sm">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewOrders(u._id)}
                      className="text-amber-600 hover:text-amber-500 text-sm mr-4"
                    >
                      {orders && orders[0]?.user?._id === u._id ? 'Hide Orders' : 'View Orders'}
                    </button>
                    {u._id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ordersLoading && (
        <div className="mt-6 text-center text-stone-500">Loading orders...</div>
      )}

      {orders && !ordersLoading && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Orders — {orders[0]?.user?.name || 'User'}
          </h2>
          {orders.length === 0 ? (
            <p className="text-stone-500">This user has no orders.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-stone-200 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-stone-500">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span>{item.wine?.name} × {item.quantity}</span>
                        <span>${(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
