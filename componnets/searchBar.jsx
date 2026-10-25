"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

export default function SearchBar() {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentQuery = searchParams.get("query") || "";

    const [searchTerm, setSearchTerm] = useState(currentQuery);
    const timerRef = useRef(null);
    const lastNavigatedQueryRef = useRef(currentQuery);

    // Synchronize input if URL changes externally (e.g. back/forward navigation)
    useEffect(() => {
        if (currentQuery !== lastNavigatedQueryRef.current) {
            setSearchTerm(currentQuery);
            lastNavigatedQueryRef.current = currentQuery;
        }
    }, [currentQuery]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const performSearch = useCallback((queryToSearch) => {
        const trimmed = queryToSearch.trim();
        const currentTrimmed = (searchParams.get("query") || "").trim();

        if (trimmed === currentTrimmed && pathName === "/search") {
            return;
        }

        lastNavigatedQueryRef.current = trimmed;

        if (trimmed) {
            router.replace(`/search?query=${encodeURIComponent(trimmed)}`);
        } else if (pathName === "/search") {
            router.replace("/search");
        }
    }, [pathName, router, searchParams]);

    const handleClick = () => {
        if (pathName !== "/search") {
            router.push("/search");
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            performSearch(value);
        }, 450);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            performSearch(searchTerm);
        }
    };

    return (
        <div className="w-full h-20 text-white flex items-center justify-center text-3xl font-bold mt-30">
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={handleChange}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-label="Search for a movie"
                className="focus:outline-0 w-[80%] h-10 rounded-lg p-2 text-white text-center border-b-2 border-b-blue-400"
            />
        </div>
    );
}