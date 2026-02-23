"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, Search, Flame, Heart } from 'lucide-react';
import Image from "next/image";
import "./css/sidebar.css";

const SidebarItem = ({ href, icon: Icon, text }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`sidebar-link ${isActive ? 'active' : ''}`}
        >
            <Icon size={24} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
            <span className="tracking-wide">{text}</span>
        </Link>
    );
};

function SideBar() {
    return (
        <aside className="fixed hidden md:flex flex-col z-[60] top-0 left-0 h-full w-64 sidebar p-6">
            <div className="flex flex-col h-full">
                {/* Navigation Links */}
                <div className="space-y-4 flex-grow overflow-y-auto sidebar-scroll pr-2 mt-4">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 ml-4">Main Menu</p>
                    <SidebarItem href="/" icon={Home} text="Home" />
                    <SidebarItem href="/search" icon={Search} text="Search" />
                    <SidebarItem href="/trendings" icon={Flame} text="Trendings" />
                    <SidebarItem href="/favorites" icon={Heart} text="Favorites" />
                </div>

                {/* Bottom Section */}
                <div className="mt-auto pt-6 border-t border-slate-800/50">
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="relative w-32 h-12 opacity-80 hover:opacity-100 transition-opacity">
                            <Image
                                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                                alt="TMDB Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-[11px] text-slate-500 text-center font-bold tracking-wider">
                            POWERED BY <span className="text-blue-500">TMDB</span>
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SideBar;