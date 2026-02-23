import Card from "@/componnets/card";
import { APIRequests } from "@/store/api"
import Pagination from "@/componnets/Pagination";
import MovieFilter from "@/componnets/MovieFilter";
import BackButton from "@/componnets/BackButton";

export default async function Trendings({ searchParams }) {
    const { page, genres, sort } = await searchParams;

    const filters = {
        genres,
        sort
    };

    const trendings = await APIRequests.trending(page || 1, filters)

    return (
        <div className="min-h-screen bg-slate-900 pt-24 pb-20 px-4 md:px-12">
            <div className="mb-8">
                <BackButton />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-center text-blue-500 mb-12">Trending Movies</h1>

            <div className="flex justify-center mb-10">
                <MovieFilter />
            </div>

            <main className="container mx-auto px-4">
                <div className="flex flex-wrap gap-10 justify-center">
                    {
                        trendings?.results?.map((movie) => {
                            return <Card key={movie.id} {...movie} />
                        })
                    }
                </div>
                {
                    trendings?.total_pages > 1 && (
                        <div className="py-10">
                            <Pagination totalPages={trendings.total_pages} page={page} />
                        </div>
                    )
                }
            </main>
        </div>
    )
}

