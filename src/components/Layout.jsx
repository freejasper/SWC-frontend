import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

export default function Layout() {
  const { user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <nav className="bg-stone-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold tracking-tight">SWC Wines</Link>
            <div className="flex items-center gap-6">
              <Link to="/wines" className="hover:text-amber-300 transition">Wines</Link>
              <Link to="/producers" className="hover:text-amber-300 transition">Producers</Link>
              <Link to="/contact" className="hover:text-amber-300 transition">Contact</Link>
              <Link to="/cart" className="hover:text-amber-300 transition relative">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-amber-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-amber-300 hover:text-amber-200 text-sm">Admin</Link>
                  )}
                  <Link to="/orders" className="hover:text-amber-300 transition text-sm">Orders</Link>
                  <span className="text-stone-400 text-sm">{user.name}</span>
                  <button onClick={handleLogout} className="text-stone-400 hover:text-white text-sm">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="hover:text-amber-300 transition">Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-sm">
        &copy; {new Date().getFullYear()} SWC Wines. All rights reserved.
      </footer>
    </div>
  )
}
