import React, { memo, useState, useMemo, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LuShoppingCart, LuSearch, LuHeart, LuX, LuUserRound, LuAlignRight } from 'react-icons/lu'
import { GiTwoCoins } from "react-icons/gi"
import LogoGBW from '../assets/images/logoGBW.png'
import LogoGBB from '../assets/images/logoGBB.png'
import MobileLogo from '../assets/images/MobileLogo.png'
import ThemeToggle from './ThemeToggle'
import AuthModal from '../pages/auth/AuthModal'

const dummySuggestions = [
  'Paper Notebooks',
  'Glass Bottles',
  'Plastic Clothing',
  'Shopping Bags',
  'Wood Furniture',
  'Aluminum Cans',
  'Tires Flooring',
  'Denim Insulation',
  'Electronic Components',
  'Ocean Plastic Sunglasses',
  'Cardboard Packaging',
  'Cork Coasters',
  'Bamboo Toothbrushes',
  'Coffee Grounds Soap',
  'Plastic Bottle Rugs',
  'Metal Scrap Art',
  'Leather Wallets',
  'Solar-Powered Phone Chargers',
  'Cotton Towels',
  'Wine Cork Bulletin Boards',
]

const useOutsideClick = (callback) => {
    const ref = useRef(null)
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [callback])

  return ref
}



const SearchBar = memo(({ searchQuery, handleSearch, clearSearch, suggestions }) => (
  <div className="relative flex w-md">
    <div className="absolute inset-y-0 start-0 flex items-center ps-2 sm:ps-3 cursor-pointer">
      <LuSearch className="w-4 h-4" />
    </div>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full px-8 sm:px-10 py-1.5 text-sm font-medium border border-gray-400 dark:border-gray-300 rounded-sm focus:outline-none focus:border-green-500"
      placeholder="Search Products......"
    />
    {searchQuery && (
      <div className="absolute inset-y-0 end-0 flex items-center pe-3">
        <LuX className="w-4 h-4 cursor-pointer hover:text-lgg" onClick={clearSearch} />
      </div>
    )}
    {searchQuery && (
      <div
        className="absolute top-10 w-full max-h-80 bg-lgg text-ow rounded-md shadow-lg overflow-auto
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-md
                  [&::-webkit-scrollbar-thumb]:bg-lgd
        "
      >
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <Link to='/shop' className='hover:font-bold cursor-pointer'>
              <div key={index} className="px-4 py-2">
              {suggestion}
            </div>
            </Link>
          ))
        ) : (
          <div className="px-4 py-2">No products found</div>
        )}
      </div>
    )}
  </div>
))



const UserSubMenu = memo(({onClose, handleLogout}) =>{

  return(
    <>
      <div className="py-4 border-b border-t border-gray-300 dark:border-gray-600">
        {[{ label: 'Profile', path: '/cprofile' },
        { label: 'My Orders', path: '/orders' },
        { label: 'My Pickups', path: '/pickups' },
        ].map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={onClose}
            className="block pl-6 py-2 transition-colors duration-300 hover:text-lgg"
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 px-6">
              <button 
              onClick={handleLogout}
              className="w-full pri-btn py-1.5 lg:px-12 font-medium">
                Logout
              </button>
      </div>

    </>
  )
})

const MobileMenu = memo(({ isOpen, navItems, isLogged, onClose, theme, setTheme, setLoginOpen, setAuthOpen, handleLogout }) => {
  const mobileMenuRef = useOutsideClick(onClose)

  return (
    <div
      ref={mobileMenuRef}
      className={`
        fixed inset-0 z-50 lg:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div 
        className={`
          absolute right-0 h-full w-64 text-tc bg-ow
          overflow-y-auto dark:bg-dsc dark:text-ow
          transition-opacity duration-500
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-600">
          <h2 className="uppercase font-semibold">Menu</h2>
          <button onClick={onClose} className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 rounded-md dark:text-ow active:text-lgg">
            <LuX className="text-2xl" />
          </button>
        </div>
        
        <div className="py-4 border-b border-gray-300 dark:border-gray-600">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `block px-6 py-2 font-medium transition duration-200 ${isActive ? 'text-lgg' : 'hover:text-lgg'}`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}


          <div className='flex justify-between px-8 py-2 items-center sm:hidden'>
            {isLogged && (
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `${isActive ? 'text-lgg' : 'hover:text-lgg'}`
                  }
                >
                  <LuHeart className="text-2xl" />
                </NavLink>
              )}

              {isLogged && (
                <Link to="/wallet" className="relative hover:text-lgg cursor-pointer">
                  <GiTwoCoins className='text-3xl'/>
                  <span className="absolute w-full text-xs font-bold text-center">
                        100
                  </span>
                </Link>
              )}
                <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
        
        {isLogged && (
            <UserSubMenu onClose={onClose} handleLogout={handleLogout} />
        )}

        {!isLogged && (
          <div className="p-6">
              <button 
                onClick={()=>{
                  onClose()
                  setLoginOpen(true)
                  setAuthOpen(true)
                }}
                className="w-full pri-btn py-2 font-medium"
              >
                Login
              </button>

              <button
                className="w-full pri-btn py-2 mt-4 font-medium"
                onClick={()=>{
                  onClose()
                  setLoginOpen(false)
                  setAuthOpen(true)
                }}
              >
                Join
              </button>
          </div>
        )}

      </div>
    </div>
  )
})

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [isLogged, setIsLogged] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(6)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
  const [authOpen, setAuthOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLogged(false);
    window.location.href = '/';
  };
  

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Recycle', path: '/recycle' },
    { label: 'Shop', path: '/shop' },
    { label: 'Help', path: '/pform' },
  ]


  const filteredSuggestions = useMemo(() => {
    if (searchQuery.length > 0) {
      return dummySuggestions.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return []
  }, [searchQuery])

  const handleSearch = (value) => {
    setSearchQuery(value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }


  const NavBar = memo(() => (
    <div className="hidden lg:flex gap-7">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `transition duration-200 ${isActive ? 'text-lgg' : 'hover:text-lgg'}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  ))



  const UserMenu = memo(() => {
    const userMenuRef = useOutsideClick(() => setIsUserMenuOpen(false))

    if (!isLogged) return null

    return (
      <div className="hidden lg:block relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center justify-center cursor-pointer hover:text-lgg"
        >
          <LuUserRound className="text-2xl" />
        </button>
          <div
          className={`
            absolute mt-3.5 right-0 bg-ow rounded-md shadow-lg dark:bg-dtc
            transform transition-all duration-200 ease-in-out origin-top-right
            ${isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
            `}
          >
            <UserSubMenu onClose={() => setIsUserMenuOpen(!isUserMenuOpen)} handleLogout={handleLogout} />
          </div>
      </div>
    )
  })

  return (
  <>
    <nav
      className="bg-ow sticky top-0 z-50 flex justify-between items-center gap-8 px-3 lg:px-12 py-2 text-tc shadow-lg dark:bg-dtc dark:text-ow"
    >
      
      <img className="hidden sm:block w-30" src={theme=='light'?LogoGBB:LogoGBW} alt="GreenBin" />
      <img className="sm:hidden w-8" src={MobileLogo} alt="GreenBin" />
        <NavBar />

        <SearchBar
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          suggestions={filteredSuggestions}
        />

        <div className="flex items-center gap-4 md:gap-6">

          {isLogged && 
            <NavLink to="/cart"
              className={({ isActive }) =>
                `relative ${isActive ? 'text-lgg' : 'hover:text-lgg'}`
              }
            >
              <LuShoppingCart className="text-xl md:text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-lgg text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>
          }

          {isLogged && (
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `${isActive ? 'text-lgg' : 'hover:text-lgg'} hidden sm:block`
              }
            >
              <LuHeart className="text-xl md:text-2xl" />
            </NavLink>
          )}

          {!isLogged && (
              <button
               className="pri-btn px-4 py-0.5 font-medium cursor-pointer hidden sm:block"
               onClick={() => {
                setLoginOpen(true)
                setAuthOpen(true)
              }}
               >
                Login
              </button>
          )}

          {!isLogged && (
              <button className="pri-btn px-4 py-0.5 font-medium cursor-pointer hidden lg:block"
              onClick={() => {
                setLoginOpen(false)
                setAuthOpen(true)
              }}
              >
                Join
              </button>
          )}

          {isLogged && (
            <NavLink to="/wallet" 
            className={({ isActive }) =>
              `${isActive ? 'text-lgg' : 'hover:text-lgg'} hidden sm:block relative`
            }
            >
              <GiTwoCoins className='text-2xl md:text-3xl'/>
              <span className="absolute w-full text-xs -mt-1 font-bold text-center">
                    100
              </span>
            </NavLink>
          )}

          <UserMenu />

          <div className="hidden sm:block">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center cursor-pointer hover:text-lgg"
          >
            <LuAlignRight className="text-xl sm:text-2xl"/>
          </button>

        </div>
    </nav>

    <MobileMenu 
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        isLogged={isLogged}
        theme={theme}
        setTheme={setTheme}
        onClose={() => setIsMobileMenuOpen(false)}
        setLoginOpen={setLoginOpen}
        setAuthOpen={setAuthOpen}
        handleLogout={handleLogout}
    />

      <AuthModal 
        authOpen={authOpen}
        loginOpen={loginOpen}
        setLoginOpen={()=>setLoginOpen(prev => !prev)}
        onClose={() => setAuthOpen(prev => !prev)}
        setIsLogged={setIsLogged}
      />
  </>
  )
}

export default Header