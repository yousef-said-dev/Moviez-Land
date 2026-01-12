"use client"
import { Home, Search, Heart, FlameIcon, LogIn, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProvider } from '@/store/Provider';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const NavItem = ({ href, icon: Icon, text, className = "", onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition duration-200 p-2 rounded-lg hover:bg-blue-900/30 ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{text}</span>
  </Link>
);

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isLoggedIn, user, setIsLoggedIn } = useProvider();

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 shadow-2xl border-b border-blue-500">
        <div className="container mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2.5 sm:py-3 md:py-3.5">
          <div className="flex justify-between items-center">
            <Link href="/" className={" text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-blue-400 tracking-wide sm:tracking-wider hover:text-blue-300 transition z-50"}>
              Moviez Land
            </Link>
            <ul className="hidden md:flex items-center space-x-1 lg:space-x-3 xl:space-x-4 2xl:space-x-6">
              <li><NavItem href="/" icon={Home} text="Home" /></li>
              <li><NavItem href="/search" icon={Search} text="Search" /></li>
              <li><NavItem href="/trendings" icon={FlameIcon} text="Trendings" /></li>
              <li><NavItem href="/favorites" icon={Heart} text="Favorites" /></li>
            </ul>
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 2xl:space-x-5">
              {isLoggedIn ? (
                <>
                  <Link href={`/profile/${user.id}`} className="flex items-center space-x-1.5 lg:space-x-2 xl:space-x-3 text-gray-300 hover:text-blue-400 transition duration-200">
                    <Image src={user.profileImg.trim()} alt="profile" width={40} height={40} className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full" />
                    <span className="text-xs lg:text-sm xl:text-base font-medium hidden lg:inline">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsLoggedIn(false); }}
                    className="text-xs lg:text-sm xl:text-base font-medium text-gray-300 px-2 py-1.5 lg:px-3 lg:py-2 xl:px-4 xl:py-2 rounded-full border border-blue-400 hover:bg-blue-600 hover:text-white transition duration-200 flex items-center space-x-1 lg:space-x-1.5"
                  >
                    <span className="hidden lg:inline">Log Out</span>
                    <LogOut className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signup" className="text-xs lg:text-sm xl:text-base font-medium text-gray-300 hover:text-blue-400 transition duration-200 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg hover:bg-blue-900/30">
                    Sign Up
                  </Link>
                  <Link href="/login" className="text-xs lg:text-sm xl:text-base font-semibold bg-blue-600 text-white py-1.5 px-3 lg:py-2 lg:px-4 xl:py-2.5 xl:px-5 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-1.5 lg:space-x-2 shadow-md">
                    <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span>Login</span>
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={toggleMobileMenu}
              className="md:hidden z-50 p-1.5 sm:p-2 text-blue-400 hover:text-blue-300 transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </nav>
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      <div className={`fixed top-0 right-0 h-full w-64 sm:w-72 bg-slate-900 border-l border-blue-500 z-40 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full pt-16 sm:pt-20 px-4 sm:px-6">
          <ul className="flex flex-col space-y-1.5 sm:space-y-2 mb-6">
            <li><NavItem href="/" icon={Home} text="Home" onClick={closeMobileMenu} /></li>
            <li><NavItem href="/search" icon={Search} text="Search" onClick={closeMobileMenu} /></li>
            <li><NavItem href="/trendings" icon={FlameIcon} text="Trendings" onClick={closeMobileMenu} /></li>
            <li><NavItem href="/favorites" icon={Heart} text="Favorites" onClick={closeMobileMenu} /></li>
          </ul>
          <div className="border-t border-blue-500/30 pt-4 sm:pt-5 mt-auto mb-6 sm:mb-8">
            {isLoggedIn ? (
              <div className="flex flex-col space-y-2.5 sm:space-y-3">
                <Link
                  href={`/profile/${user.id}`}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/30 hover:bg-blue-900/50 transition"
                >
                  <Image src={user.profileImg.trim()} alt="profile" width={40} height={40} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm sm:text-base">{user.name}</span>
                    <span className="text-gray-400 text-xs sm:text-sm">View Profile</span>
                  </div>
                </Link>
                <button
                  onClick={() => { signOut(); setIsLoggedIn(false); closeMobileMenu(); }}
                  className="w-full text-sm sm:text-base font-medium text-gray-300 p-2.5 sm:p-3 rounded-lg border border-blue-400 hover:bg-blue-600 hover:text-white active:scale-95 transition duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Log Out</span>
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="w-full text-center text-sm sm:text-base font-medium text-gray-300 hover:text-blue-400 active:scale-95 transition duration-200 p-2.5 sm:p-3 rounded-lg border border-gray-600 hover:border-blue-400"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center text-sm sm:text-base font-semibold bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 active:scale-95 transition duration-200 flex items-center justify-center space-x-2 shadow-md"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
