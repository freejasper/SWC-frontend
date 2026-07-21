import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { useLayoutEffect, useEffect } from 'react';
import { useWindowWidth } from '../utilities/useWindowWidth';

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

  const windowWidth = useWindowWidth();

  useLayoutEffect(() => {
    const footerH = document.querySelector('footer').offsetHeight;
    const copyrightH = document.querySelector('.copyright').getBoundingClientRect().height;

    document.querySelector('main').style.marginBottom = `${footerH - copyrightH}px`;
  }, [windowWidth]);

  const isMobile = windowWidth < 768;

  const location = useLocation();

  useEffect(() => {
    console.log('pathname:', location.pathname.split('/'));
  }, [location])

  const winesHeader = location.pathname.split('/')[1] === 'wines';
  const producersHeader = location.pathname.split('/')[1] === 'producers';
  const contactHeader = location.pathname.split('/')[1] === 'contact';

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full flex flex-col bg-red-primary p-0 m-0 overflow-hidden">
      <header>
        <nav className="bg-red-primary flex justify-center text-offwhite">
          <div className="flex items-center justify-between w-full">
            <div className={`w-full flex flex-wrap ${isMobile ? 'text-2xl' : 'text-3xl'} uppercase tracking-wider leading-none`}>
              
              <div
                className={`outer-header-menu w-full grid ${winesHeader ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} >
                  <Link 
                    to="/wines" 
                    className={`transition w-full text-left overflow-hidden ${winesHeader ? 'p-3' : 'p-0'}`} >
                      Wines
                  </Link>
              </div>
              
              <div 
                className={`outer-header-menu w-full grid ${producersHeader ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} >
                <Link 
                  to="/producers" 
                  className={`transition w-full text-left overflow-hidden ${producersHeader ? 'p-3' : 'p-0'}`} >
                    Producers
                </Link>
              </div>
              
              <div
                className={`outer-header-menu w-full grid ${contactHeader ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} >
                <Link 
                  to="/contact" 
                  className={`transition w-full text-left overflow-hidden ${contactHeader ? 'p-3' : 'p-0'}`} >
                    Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="px-4 rounded-full bg-red-secondary text-offwhite">
        <Link to="/" className="hover:text-red-primary transition relative">
          SWC
        </Link>
      </div>

      <main className="flex-1 mx-auto pt-22 w-full overflow-auto">
        <Outlet />
      </main>

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

      <footer className="text-center m-0 p-0">
        <div className="text-tiny text-left p-1 text-offwhite copyright">
          &copy; {new Date().getFullYear()} SWC Wines. All rights reserved.
        </div>
        <nav className="bg-offwhite flex justify-center text-red-primary">
          <div className="flex items-center justify-between w-full">
            <div className={`w-full flex flex-wrap ${isMobile ? 'text-2xl' : 'text-3xl'} uppercase tracking-wider leading-none`}>
              
              <div
                className={`outer-header-menu w-full grid ${!winesHeader ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} >
                  <Link 
                    to="/wines" 
                    className={`hover:text-offwhite hover:bg-red-primary transition w-full text-left overflow-hidden ${!winesHeader ? 'p-3' : 'p-0'}`} >
                      Wines
                  </Link>
              </div>
              
              <div 
                className={`outer-header-menu w-full grid ${!producersHeader ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} >
                <Link 
                  to="/producers" 
                  className={`hover:text-offwhite hover:bg-red-primary transition w-full text-left overflow-hidden ${!producersHeader ? 'p-3' : 'p-0'}`} >
                    Producers
                </Link>
              </div>
              
              <div
                className={`outer-header-menu w-full grid ${!contactHeader ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} >
                <Link 
                  to="/contact" 
                  className={`hover:text-offwhite hover:bg-red-primary transition w-full text-left overflow-hidden ${!contactHeader ? 'p-3' : 'p-0'}`} >
                    Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </footer>
    </div>
  )
}
