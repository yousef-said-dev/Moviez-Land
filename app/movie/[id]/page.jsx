import { APIRequests } from "@/store/api";
import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";
import TrailerButton from "@/componnets/TrailerButton";
export default async function MovieDetails({ params }) {
  const { id } = await params;
  let movie = await APIRequests.movie(id);
  const trailerPath = movie[1];
  movie = movie[0];
  console.log(trailerPath);
  console.log(movie);
  if(movie.poster_path == null || movie.poster_path == undefined || movie.poster_path == ''  || movie.poster_path == 'null' || movie.poster_path == 'undefined' || movie.poster_path == ' '){
    var imageUrl = '/placeholderimage.png';
  } else {
    var imageUrl = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
  }
  console.log(movie.poster_path);
  return (
    <div className="relative min-h-screen text-white bg-[#0B1120]">
      {/* Background */}

      <div className="absolute inset-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 pt-50 px-6 md:px-20 py-16">
        {/* Poster */}
        <div className="relative w-[250px] h-[370px] rounded-2xl overflow-hidden shadow-xl shadow-black/60">
          <Image
            src={`${imageUrl}`}
            alt={movie.title}
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-cyan-400 italic text-lg mb-6">{movie.tagline}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 text-gray-300">
            <div className="flex items-center gap-2 text-yellow-400">
              <FaStar />
              <span className="text-white">{movie.vote_average?.toFixed(1)}</span>
            </div>
            <span>{movie.release_date}</span>
            <span>{movie.runtime} min</span>
          </div>

          {/* Overview */}
          <p className="text-gray-200 leading-relaxed mb-8">{movie.overview}</p>

          {/* Genres */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-white text-black font-semibold px-4 py-1 rounded-full shadow">
              {movie.status}
            </span>
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="border border-white px-4 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <TrailerButton trailerPath={trailerPath} />
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-black/70 hover:bg-red-600 transition-colors shadow-lg font-semibold cursor-pointer">
              <FaHeart  /> Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
