"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
function Pagination({ totalPages }) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', currentPage);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl);
    }, [currentPage])
    return (
        <div className="flex justify-center items-center w-fit my-10 gap-2 mx-auto border-2 border-blue-800 rounded-full">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="text-blue-500 hover:text-blue-800 cursor-pointer font-bold py-2 px-4 rounded">Prev</button>
            <span className="text-white"> <Link href="" className="text-blue-400 me-1" onClick={() => handlePageChange(currentPage - 1)}> {currentPage - 1 > 0 ? currentPage - 1 : ''}</Link>{currentPage} <Link className="text-blue-500" href="" onClick={() => handlePageChange(currentPage + 1)}> {currentPage + 1 <= totalPages ? currentPage + 1 : ''}</Link></span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="text-blue-500 hover:text-blue-800 cursor-pointer font-bold py-2 px-4 rounded">Next</button>
        </div>
    )
}
export default Pagination;