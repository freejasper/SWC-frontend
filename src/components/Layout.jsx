import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { useLayoutEffect } from 'react';

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

  useLayoutEffect(() => {
    const footerH = document.querySelector('footer').offsetHeight;

    document.querySelector('main').style.paddingBottom = `${footerH + 30}px`;
  }, []);

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full flex flex-col bg-red-primary p-0 m-0">

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-22 w-full">
        <Outlet />
      </main>
      
      <div className="fixed top-2 left-2 p-4 rounded-full bg-red-secondary text-offwhite">
        <Link to="/" className="hover:text-red-primary transition relative">
          SWC
        </Link>
      </div>

      <div className="fixed top-12 right-2 p-4 rounded-full bg-red-secondary text-offwhite">
        <Link to="/cart" className="hover:text-red-primary transition relative">
          Cart
          {cartCount > 0 && (
            <span className="absolute bg-amber-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div className="fixed top-2 right-12 p-4 rounded-full bg-red-secondary text-offwhite">
        {user ? (
          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link to="/admin" className="text-amber-300 hover:text-amber-200 text-sm">Admin</Link>
            )}
            <Link to="/orders" className="hover:text-red-primary transition text-sm">Orders</Link>
            <span className="text-stone-400 text-sm">{user.name}</span>
            <button onClick={handleLogout} className="text-stone-400 hover:text-white text-sm">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:text-red-primary transition">Login</Link>
          </div>
        )}
      </div>

      <footer className="bg-offwhite text-red-primary text-center m-0 p-0">
        <nav className="flex justify-center">
          <div className="flex items-center justify-between w-full">
            <div className="w-full flex flex-wrap text-3xl uppercase tracking-widest leading-none">
              <Link to="/wines" className="hover:text-offwhite hover:bg-red-primary transition w-full text-left p-3">Wines</Link>
              <Link to="/producers" className="hover:text-offwhite hover:bg-red-primary transition w-full text-left p-3">Producers</Link>
              <Link to="/contact" className="hover:text-offwhite hover:bg-red-primary transition w-full text-left p-3">Contact</Link>
            </div>
          </div>
        </nav>
        <div className="text-tiny text-left px-1">
          &copy; {new Date().getFullYear()} SWC Wines. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
