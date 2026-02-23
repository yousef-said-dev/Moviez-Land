import { APIRequests } from "@/store/api";
import SearchBar from "@/componnets/searchBar";
import Card from "@/componnets/card";
import HeroSection from "@/componnets/HeroSection";
import Pagination from "@/componnets/Pagination";
import MovieFilter from "@/componnets/MovieFilter";
import { Suspense } from "react";
import Loader from "@/componnets/Loader";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }) {
  const { page, genres, sort } = await searchParams;
  if (!page) {
    new URLSearchParams().set('page', '1');
    return redirect("/?page=1")
  }

  const filters = {
    genres,
    sort
  };

  const movies = await APIRequests.movies(page, filters)
  return (
    <>
      <div className="font-sans min-h-screen pt-24 p-8 pb-20 sm:p-20 bg-slate-900 text-white">

        <HeroSection SearchBarComponent={SearchBar} />

        <div className="flex justify-center mt-8 mb-6">
          <MovieFilter />
        </div>

        <main className="flex flex-col gap-[32px] items-center sm:items-start mt-10">
          <div className="flex flex-wrap gap-10 justify-center">
            <Suspense fallback={<Loader />}>
              {movies?.results?.map((movie) => (
                <Card key={movie.id} {...movie} />
              ))}
            </Suspense>
          </div>
        </main>
        <Pagination totalPages={movies?.total_pages} page={page} />
      </div>
    </>
  );
}