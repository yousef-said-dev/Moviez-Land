"use client"
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton({ className = "" }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={`flex items-center   z-1 gap-3 px-6 py-3 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-gray-400 hover:text-white hover:bg-blue-600/25 hover:border-blue-500/50 transition-all duration-300 group shadow-2xl ${className}`}
            title="Go Back"
        >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1.5 transition-transform duration-300" />
            <span className="font-bold text-base tracking-wide uppercase">Go Back</span>
        </button>
    );
}
