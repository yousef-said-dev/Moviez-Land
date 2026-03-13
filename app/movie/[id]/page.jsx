import { APIRequests } from "@/store/api";
import Image from "next/image";
import { FaHeart, FaStar, FaFilm } from "react-icons/fa";
import TrailerButton from "@/componnets/TrailerButton";
import Heart from "@/componnets/Heart";
import BackButton from "@/componnets/BackButton";
import Card from "@/componnets/card";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const movieData = await APIRequests.movie(id);
  const movie = movieData[0];

  return {
    title: movie ? `${movie.title} - MoviezLand` : 'Movie Details - MoviezLand',
    description: movie?.overview || 'Movie details and trailer',
  }
}

export default async function MovieDetails({ params }) {
  const { id } = await params;
  const [movieResult, similarResult] = await Promise.all([
    APIRequests.movie(id),
    APIRequests.similar(id)
  ]);

  const trailerPath = movieResult[1];
  const movie = movieResult[0] ? movieResult[0] : 'No Trailer Available';
  const similarMovies = similarResult?.results || [];

  let imageUrl;
  if (!movie.poster_path || movie.poster_path === 'null' || movie.poster_path === 'undefined') {
    imageUrl = '/placeholderimage.png';
  } else {
    imageUrl = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
  }

  return (
    <div className="relative min-h-screen text-white bg-[#0B1120]">
      <div className="pt-8 px-6 md:px-12 lg:px-20 relative z-50">
        <BackButton />
      </div>

      <div className="absolute inset-0 h-[70vh]">
        <Image
          src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/70 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 pt-24 md:pt-32 px-6 md:px-12 lg:px-20 py-12">
        <div className="relative w-[280px] h-[420px] mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10 shrink-0">
          <Image
            src={`${imageUrl}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-center max-w-4xl text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-blue-400 italic text-lg md:text-xl mb-6 font-medium opacity-90">{movie.tagline}</p>
          )}

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 mb-8 text-gray-300 font-medium">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
              <FaStar className="text-yellow-400" />
              <span className="text-white text-lg">{movie.vote_average?.toFixed(1)}</span>
            </div>
            <span className="opacity-60">|</span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span className="opacity-60">|</span>
            <span>{movie.runtime} min</span>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 font-light italic">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold px-5 py-1.5 rounded-full text-xs uppercase tracking-wider">
              {movie.status}
            </span>
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
            <TrailerButton trailerPath={trailerPath} />
            <Heart movieId={movie.id} isComplete={true} />
          </div>
        </div>
      </div>

      {/* Suggested Movies Section */}
      {similarMovies.length > 0 && (
        <div className="relative z-10 px-6 md:px-12 lg:px-20 py-20 bg-gradient-to-b from-transparent to-black/40">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
            <div className="flex flex-col">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">More Like This</h2>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recommended for you</span>
            </div>
            <FaFilm className="ml-auto text-blue-500/20 w-12 h-12" />
          </div>

          <div className="flex overflow-x-auto pb-10 gap-2 no-scrollbar scroll-smooth">
            {similarMovies.slice(0, 12).map((m) => (
              <div key={m.id} className="shrink-0 transition-transform hover:scale-105 duration-300">
                <Card {...m} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

