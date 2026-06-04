import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrders } from '../store/ordersSlice'

export default function OrdersPage() {
  const dispatch = useDispatch()
  const { list: orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (loading) return <div className="text-center py-12 text-stone-500">Loading orders...</div>

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-stone-900 mb-4">No Orders Yet</h1>
        <p className="text-stone-500 mb-6">You haven't placed any orders yet.</p>
        <Link to="/wines" className="text-amber-600 hover:text-amber-500 font-medium">Browse Wines &rarr;</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-stone-500">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
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

            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.wine?.name} × {item.quantity}</span>
                  <span className="text-stone-600">${(item.priceAtOrder * item.quantity).toFixed(2)}</span>
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
    </div>
  )
}
