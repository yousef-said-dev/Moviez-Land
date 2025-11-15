"use client"
import { Home, Search, Heart,  LogIn, FlameIcon, UserCircleIcon, LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { useProvider } from '@/store/Provider';
// Reusable component for a navigation item
const NavItem = ({ href, icon: Icon, text, className = "" }) => (
  <Link 
    href={href} 
    className={`flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition duration-200 p-2 rounded-lg hover:bg-blue-900/30 ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium hidden sm:inline">{text}</span>
  </Link>
);

export default function Header() {
  const { isLoggedIn,user, setIsLoggedIn } = useProvider();
  console.log(user);
  return (
    // Fixed header at the top, dark background to match the theme
    <nav className="fixed top-0 left-0 right-0 md:top-0 sm:fixed z-20 bg-slate-900 shadow-2xl border-b border-blue-800/50">
      <div className="container mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl  font-black text-blue-400 tracking-wider hover:text-blue-300 transition">
          Moviez Land
        </Link>

        {/* Primary Navigation (Centered) */}
        <ul className="flex items-center  space-x-1 sm:space-x-4">
          <li>

          <NavItem href="/" icon={Home} text="Home" />
          </li>
          <li>
          <NavItem href="/search" icon={Search} text="Search" />
          </li>
          <li>
          <NavItem href="/trendings" icon={FlameIcon} text="Trendings" />
          </li>
          <li>
          <NavItem href="/favorites" icon={Heart} text="Favorites" />
          </li>
        </ul>

        {/* Authentication Links (Right) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {
            isLoggedIn?(
              <>
                <Link href="/profile" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition duration-200  sm:block">
                    <UserCircleIcon className="w-5 h-5 inline" />
                </Link>
                    <p className="inline text-white">{user.name}</p>
                <button onClick={() => {setIsLoggedIn(false)}} className="text-sm font-medium text-gray-300 bg-gradient-to-r  p-2  rounded-full border border-blue-400 hover:text-blue-400 transition duration-200 hidden sm:block">
                    <p className='inline'>Log Out</p><LogInIcon className="inline ml-1 w-5 h-5"/>
                </button>
              </>
            ):(
              <>
              <Link 
              href="/signup" 
            className="text-sm font-medium text-gray-300 hover:text-blue-400 transition duration-200 hidden sm:block"
          >
            Sign Up
          </Link>

          <Link 
          href="/login" 
          className="text-sm font-semibold bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-1 shadow-md"
          >
            <LogIn className="w-4 h-4 mr-1 sm:mr-0" />
            <span className="hidden sm:inline">Login</span>
          </Link>
              </>
          )
        }
        </div>
      </div>
    </nav>
  );
}
