"use client";
import { useState} from "react";
import { FaPlay } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
export default function TrailerButton({trailerPath}) {
    const [trailer, setTrailer] = useState(false);
    console.log(trailerPath);
    return (
        <>
            <button onClick={()=>setTrailer(!trailer)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition-colors shadow-lg font-semibold cursor-pointer">
                <FaPlay /> Watch Trailer
            </button>
            <button className={`${trailer ? 'absolute' : 'hidden'} top-20 right-10 z-60 text-white text-4xl `} onClick={()=>setTrailer(!trailer)}>
                <FaWindowClose></FaWindowClose>
            </button>
            {
                trailer &&
            <iframe className={`absolute w-full top-0 left-0 h-screen opacity-100 z-50`}
            src={trailerPath}>
            </iframe>
                }
        </>
    );

}
