import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { useEffect, useState } from 'react';
import { useWindowWidth } from '../utilities/useWindowWidth';

import IconLogo from '../assets/IconLogo';

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

  const location = useLocation();


  const isMobile = windowWidth < 768;

  useEffect(() => {
    console.log('pathname:', location.pathname.split('/'));
  }, [location])

  const home = !location.pathname.split('/')[1];

  const [navActive, setNavActive] = useState(false);

  const toggleNav = () => {
    setNavActive(!navActive);
  }

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full flex flex-col bg-red-primary p-0 m-0 overflow-hidden justify-center items-center">

      {!home &&
        <header
          // ref={logoRef}
          className={`
            z-10
            text-offwhite
            pb-6 
            ${isMobile ? 'pt-2 self-start px-4 sm:px-6 lg:px-8' : 'pt-0'} 
            flex`}>
          <Link to="/" className="hover:text-red-primary transition relative">
              <>
                {isMobile ? <IconLogo width={windowWidth * 0.4} /> : <IconLogo width={windowWidth / 5} />}
              </>
          </Link>
        </header>
      }

      <main className="flex-1 mx-auto w-full overflow-auto">
        <Outlet />
      </main>

      <nav className="z-1 fixed top-2 right-2 flex flex-wrap items-end justify-end gap-1">
        <div className="w-12 h-12 flex items-center justify-center grow-0 rounded-full bg-offwhite text-red-primary hover:text-offwhite hover:bg-red-secondary transition">
          <Link to="/cart" className="relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <button
          onClick={toggleNav}
          className={`zero-style-button
                      w-12 h-12  
                      rounded-full
                      noshrink 
                      bg-offwhite
                      ${navActive ? 'bg-red-secondary' : 'bg-offwhite'} 
                      ${navActive ? 'text-offwhite' : 'text-red-primary'} 
                      hover:text-offwhite hover:bg-red-secondary 
                      transition
                      text-center`}>
            +
        </button>
        
        <div
          className={`basis-full flex flex-col justify-end gap-1 
                    overflow-hidden
                    ${navActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                    transition`}>
          <div className="flex gap-1 justify-end">
            <div className="rounded-full bg-offwhite text-red-primary hover:text-offwhite hover:bg-red-secondary transition">
              <Link 
                to="/wines" 
                onClick={toggleNav}
                className="w-full text-left px-3 py-2 w-[100%] h-[100%]">
                  Wines
              </Link>
            </div>
            <div className="rounded-full bg-offwhite text-red-primary hover:text-offwhite hover:bg-red-secondary transition">
              <Link 
                to="/producers" 
                onClick={toggleNav}
                className="w-full text-left px-3 py-2 w-[100%] h-[100%]">
                  Producers
              </Link>
            </div>
          </div>
          <div className="flex gap-1 justify-end">
            <div className="rounded-full bg-offwhite text-red-primary hover:text-offwhite hover:bg-red-secondary transition">
              <Link 
                to="/contact"
                onClick={toggleNav} 
                className="w-full text-left px-3 py-2 w-[100%] h-[100%]">
                  Contact
              </Link>
            </div>
            <div className="rounded-full bg-offwhite text-red-primary hover:text-offwhite hover:bg-red-secondary transition">
              {user ? (
                <div className="flex items-center gap-1">
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin"
                      onClick={toggleNav} 
                      className="text-amber-300 hover:text-amber-200 text-sm px-3 py-2 w-[100%] h-[100%]">Admin</Link>
                  )}
                  <Link to="/orders" className="hover:text-offwhite hover:bg-red-secondary transition text-sm px-3 py-2 w-[100%] h-[100%]">Orders</Link>
                  <span className="text-stone-400 text-sm">{user.name}</span>
                  <button onClick={() => { handleLogout(); toggleNav;}} className="text-stone-400 hover:text-white text-sm px-3 py-2 w-[100%] h-[100%]">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link 
                    to="/login"
                    onClick={toggleNav} 
                    className="px-3 py-2 w-[100%] h-[100%]">
                      Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>


      <footer className="text-center m-0 p-0">
        <div className="text-tiny p-1 font-semibold text-offblack">
          &copy; {new Date().getFullYear()} SWC Wines. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
