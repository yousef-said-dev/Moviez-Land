
import SearchBar from "@/componnets/searchBar";
import { APIRequests } from "@/store/api";
import Pagination from "@/componnets/Pagination";
import Card from "@/componnets/card";
import { Suspense } from "react";
import Loader from "@/componnets/Loader";
import MovieFilter from "@/componnets/MovieFilter";
import BackButton from "@/componnets/BackButton";

export default async function Search({ searchParams }) {
  const { query, page, genres, sort } = await searchParams;
  const movies = await APIRequests.search(query, page || 1);

  let filteredResults = movies?.results || [];

  if (genres && filteredResults.length > 0) {
    const genreIds = genres.split(",").map(Number);
    filteredResults = filteredResults.filter(movie =>
      movie.genre_ids?.some(id => genreIds.includes(id))
    );
  }


  return (
    <>
      <div className="pt-24 min-h-screen bg-slate-900 px-4 md:px-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <SearchBar />

        <div className="flex justify-center mt-8 mb-6">
          <MovieFilter />
        </div>

        <div className="flex flex-wrap gap-10 justify-center px-4">
          <Suspense fallback={<Loader />}>
            {
              query ? (
                filteredResults.length > 0 ? (
                  filteredResults.map((movie) => (
                    <Card key={movie.id} {...movie} />
                  ))
                ) : (
                  <div className="text-center w-full mt-10">
                    <p className="text-white text-xl">
                      {movies?.results?.length > 0 ? "No movies match your filters in these results" : "No movies found for this search"}
                    </p>
                  </div>
                )
              ) : (
                <p className="text-white text-2xl font-semibold text-center mt-10">Search For A Movie</p>
              )
            }
          </Suspense>
        </div>
        {
          movies?.total_pages > 1 && (
            <div className="py-10">
              <Pagination totalPages={movies.total_pages} page={page} />
            </div>
          )
        }
      </div>
    </>
  )
}
