"use client";
import { FaHeart } from "react-icons/fa";
import { useProvider } from "@/store/Provider";
import { APIRequests } from "@/store/api";
import Link from "next/link";
import Card from "@/componnets/card";
import MovieFilter from "@/componnets/MovieFilter";
import BackButton from "@/componnets/BackButton";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export default function FavoritesMovies() {
  const { user } = useProvider();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user || !user.favorites || user.favorites.length === 0) {
      setMovies([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const promises = user.favorites.map(id => APIRequests.movie(id));
        const results = await Promise.all(promises);
        setMovies(results.map(item => item[0]));
      } catch (err) {
        console.error("Error fetching favorite movies:", err);
      }
    };

    fetchFavorites();
  }, [user?.favorites]);

  useEffect(() => {
    let filtered = [...movies];

    const genres = searchParams.get("genres");
    const year = searchParams.get("year");
    const rating = searchParams.get("rating");
    const sort = searchParams.get("sort");

    if (genres) {
      const genreIds = genres.split(",").map(Number);
      filtered = filtered.filter(movie =>
        movie.genres?.some(g => genreIds.includes(g.id))
      );
    }

    if (year) {
      filtered = filtered.filter(movie =>
        movie.release_date?.startsWith(year)
      );
    }

    if (rating) {
      filtered = filtered.filter(movie =>
        movie.vote_average >= parseFloat(rating)
      );
    }

    if (sort) {
      filtered.sort((a, b) => {
        switch (sort) {
          case "popularity.desc":
            return b.popularity - a.popularity;
          case "popularity.asc":
            return a.popularity - b.popularity;
          case "vote_average.desc":
            return b.vote_average - a.vote_average;
          case "vote_average.asc":
            return a.vote_average - b.vote_average;
          case "release_date.desc":
            return new Date(b.release_date) - new Date(a.release_date);
          case "release_date.asc":
            return new Date(a.release_date) - new Date(b.release_date);
          case "title.asc":
            return a.title.localeCompare(b.title);
          case "title.desc":
            return b.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    setFilteredMovies(filtered);
  }, [movies, searchParams]);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      {!user ? (
        <div className="flex flex-col justify-center items-center h-[60vh] px-4">
          <FaHeart className="text-blue-400/20 mb-6 animate-pulse" size={120} />
          <p className="text-2xl md:text-3xl text-center text-white font-bold max-w-md">
            You Should <Link href="/login" className="text-blue-500 hover:text-blue-400 underline decoration-2 underline-offset-4 transition-colors">Login</Link> to see your favorite movies
          </p>
        </div>
      ) : (
        <section className="container mx-auto px-4">
          <div className="mb-8">
            <BackButton />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-center text-blue-500 mb-12">Your Favorites</h1>

          <div className="flex justify-center mb-10">
            <MovieFilter />
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {filteredMovies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 w-full text-center">
                <p className="text-2xl text-gray-400 font-semibold mb-2">
                  {movies.length === 0 ? "You don't have any favorite movies yet." : "No movies match your filters."}
                </p>
                {movies.length === 0 && (
                  <Link href="/" className="text-blue-500 hover:underline">Start exploring</Link>
                )}
              </div>
            ) : (
              filteredMovies.map((movie) => (
                <Card key={movie.id} {...movie} />
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
