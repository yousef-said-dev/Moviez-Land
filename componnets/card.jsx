
import Heart from "./Heart";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import "@/componnets/css/card.css";
function Card({ ...movie }) {
  let imageUrl;
  if (movie.poster_path == null || movie.poster_path == undefined || movie.poster_path == '' || movie.poster_path == 'null' || movie.poster_path == 'undefined' || movie.poster_path == ' ') {
    imageUrl = '/placeholderimage.png';
  } else {
    imageUrl = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
  }
  return (
    <div className="card hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.03] transition-all duration-500 ease-in-out relative group w-[220px] h-[330px] rounded-2xl overflow-hidden shadow-lg shadow-black/50 mx-4 my-6">
      <Link href={`/movie/${movie.id}`}>
        <Suspense fallback={<Loader />}>
          <Image
            src={imageUrl.trim()}
            alt={movie.title || "Movie poster"}
            width={220}
            height={330}
            loading="lazy"
            unoptimized={imageUrl.startsWith("http")}
            className="card_image object-cover relative"
          />
        </Suspense>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4 z-20 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-white font-bold text-[15px] leading-tight mb-1 truncate">{movie.title}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-500 text-xs">
            <FaStar />
            <span className="text-white font-medium">{movie.vote_average?.toFixed(1)}</span>
          </div>
          <span className="text-gray-400 text-[10px] uppercase tracking-widest">{movie.release_date?.split('-')[0]}</span>
        </div>
      </div>

      <div className="card_details absolute inset-0 flex flex-col justify-center items-center text-center p-6 pointer-events-none pt-12">
        <h3 className="text-white font-black text-xl leading-tight mb-3 drop-shadow-md">
          {movie.title}
        </h3>

        <div className="stats flex items-center justify-center gap-4 mb-4">
          <div className="rating_chip flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
          <span className="text-gray-300 text-xs font-bold tracking-widest bg-white/10 px-2 py-0.5 rounded border border-white/5">
            {movie.release_date?.split('-')[0]}
          </span>
        </div>

        <p className="text-gray-200 text-[11px] leading-relaxed mb-6 line-clamp-4 px-2 opacity-90 font-medium tracking-tight">
          {movie.overview}
        </p>

        <Link
          href={`/movie/${movie.id}`}
          className="btn pointer-events-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-400 text-white text-[10px] font-black uppercase tracking-[2px] rounded-sm transition-all shadow-[0_0_15px_rgba(43,127,255,0.4)] hover:shadow-blue-500/60"
        >
          Explore Now
        </Link>
      </div>

      <Heart movieId={movie.id} />


    </div>
  );
}

export default Card;
