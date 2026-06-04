import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateQuantity, removeFromCart, clearCart } from '../store/cartSlice'
import { placeOrder } from '../store/ordersSlice'
import toast from 'react-hot-toast'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.orders)

  const total = items.reduce((sum, item) => sum + item.wine.price * item.quantity, 0)

  const handleSubmitOrder = async () => {
    if (!user) {
      toast.error('Please login to submit an order')
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    const orderItems = items.map((i) => ({
      wineId: i.wine._id,
      quantity: i.quantity,
    }))

    try {
      await dispatch(placeOrder({ items: orderItems })).unwrap()
      dispatch(clearCart())
      toast.success('Order submitted successfully!')
      navigate('/orders')
    } catch (err) {
      toast.error(err || 'Failed to submit order')
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-stone-900 mb-4">Your Cart is Empty</h1>
        <p className="text-stone-500">Browse our wines and add some to your order.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Your Order</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.wine._id} className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 flex items-center gap-4">
            {item.wine.imageUrl && (
              <img src={item.wine.imageUrl} alt={item.wine.name} className="w-20 h-20 object-cover rounded" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-stone-900">{item.wine.name}</h3>
              <p className="text-stone-500 text-sm">{item.wine.producer?.name}</p>
              <p className="text-amber-600 font-bold">${item.wine.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(updateQuantity({ wineId: item.wine._id, quantity: item.quantity - 1 }))}
                className="w-8 h-8 border border-stone-300 rounded hover:bg-stone-100"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => dispatch(updateQuantity({ wineId: item.wine._id, quantity: item.quantity + 1 }))}
                className="w-8 h-8 border border-stone-300 rounded hover:bg-stone-100"
              >
                +
              </button>
            </div>
            <div className="text-right w-24">
              <p className="font-bold text-stone-900">${(item.wine.price * item.quantity).toFixed(2)}</p>
            </div>
            <button
              onClick={() => dispatch(removeFromCart(item.wine._id))}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <div className="flex justify-between items-center text-xl font-bold text-stone-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleSubmitOrder}
          disabled={loading}
          className="mt-4 w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-500 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Order'}
        </button>
      </div>
    </div>
  )
}
