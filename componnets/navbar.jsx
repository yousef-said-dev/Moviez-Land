"use client"
import { Home, Search, Heart, FlameIcon, LogIn, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProvider } from '@/store/Provider';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import './css/navbar.css';

const NavItem = ({ href, icon: Icon, text, className = "", onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`nav-link flex items-center space-x-2 ${className}`}
  >
    <Icon className="w-4 h-4 opacity-70" />
    <span className="text-sm">{text}</span>
  </Link>
);

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, setIsLoggedIn } = useProvider();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      <nav className={`fixed top-0 md:left-64 left-0 right-0 z-50 navbar-container ${scrolled ? 'scrolled' : 'py-2'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group z-50">
              <div className="relative w-20 h-20 md:w-12 md:h-12 logo-glow transition-transform duration-500 group-hover:rotate-[360deg]">
                <Image
                  src="/main_logo.png"
                  alt="Moviez Land Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl md:text-2xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">
                  MOVIEZ<span className="text-blue-500">LAND</span>
                </span>
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Land of Entertainment</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {isLoggedIn ? (
                <div className="flex items-center space-x-6">
                  <Link href={`/profile/${user?.id}`} className="group flex items-center space-x-4">
                    <div className="relative w-11 h-11 border-2 border-transparent group-hover:border-blue-500 rounded-full transition-all duration-300 p-0.5 shadow-xl">
                      <Image
                        src={user?.profileImg.trim()}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="text-base font-bold text-gray-200 group-hover:text-white transition-colors">{user?.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsLoggedIn(false); }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                    title="Log Out"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link href="/login" className="text-base font-bold text-gray-300 hover:text-white transition-colors">
                    Log In
                  </Link>
                  <Link href="/signup" className="text-base font-black premium-button text-white px-8 py-3 rounded-full shadow-2xl">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden z-50 p-2 text-gray-300 hover:text-white transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-[280px] bg-slate-900/95 backdrop-blur-xl border-l border-blue-500/20 z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-6">
          <div className="space-y-6">
            <NavItem href="/" icon={Home} text="Home" onClick={closeMobileMenu} />
            <NavItem href="/search" icon={Search} text="Search" onClick={closeMobileMenu} />
            <NavItem href="/trendings" icon={FlameIcon} text="Trendings" onClick={closeMobileMenu} />
            <NavItem href="/favorites" icon={Heart} text="Favorites" onClick={closeMobileMenu} />
          </div>

          <div className="mt-auto mb-12 space-y-4">
            {isLoggedIn ? (
              <div className="p-4 bg-blue-900/20 rounded-2xl border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Image src={user?.profileImg.trim()} alt="profile" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="text-white font-bold text-sm">{user?.name}</p>
                    <p className="text-gray-500 text-xs">Premium User</p>
                  </div>
                </div>
                <button
                  onClick={() => { signOut(); setIsLoggedIn(false); closeMobileMenu(); }}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="py-4 text-center text-gray-300 font-bold border border-gray-800 rounded-2xl"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="py-4 text-center text-white premium-button rounded-2xl font-bold"
                >
                  Join Moviez Land
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

