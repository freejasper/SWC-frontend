import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrders } from '../../store/ordersSlice'
import { updateOrderStatus } from '../../api/orderApi'
import toast from 'react-hot-toast'

const statusColours = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { list: orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)
      toast.success('Order status updated')
      dispatch(fetchOrders())
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="text-center py-12 text-stone-500">Loading orders...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-stone-500">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Order #{order._id.slice(-8)} &middot; {order.user?.name} ({order.user?.email})
                  </p>
                  <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${statusColours[order.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1 mb-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.wine?.name} × {item.quantity}</span>
                    <span>${(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
