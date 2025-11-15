"use client";
import { APIRequests } from "@/store/api";
import Card from "@/componnets/card";
import Link from "next/link";
import { useProvider } from "@/store/Provider";
import { useEffect, useState } from "react";
export default  function Favorites(){
  const {user, isLoggedIn} = useProvider();
  const [favorites,setFavorites] = useState([])
  const [movies, setMovie] = useState([]);
  console.log(isLoggedIn);
  if(!isLoggedIn){
    return(
      <p className="text-3xl text-center mt-100 font-bold text-blue-500">Yor Should <Link href="/login" className="text-blue-600 hover:text-blue-400">Login</Link> to See Favorites.</p>
    )
  }
  useEffect(()=>{
  try{
    if(user.favorites.length > 0){
      console.log("There is a Favorite ");
      user.favorites.forEach( (id) => {
        console.log("Fetching Movie");
       (async ()=>{
          var movie = await APIRequests.movie(id) ;
          movie = movie[0]
          console.log(movie);
          console.log("Adding Fetched Movie");
          setMovie(prevMovies => [...prevMovies, movie])
        })()
      });
    }else{
      console.log("Length is Zero.");
    }
      
    } catch(err){
      console.log('Error Fetching Favorites Movies');
    }
  },[])
  
 console.log(user.favorites);
 console.log(movies);
  return(
  <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-wrap gap-10 justify-center">
          {movies?.length > 0 ? map((movie)=> ( 
          <Card key={movie.id} {...movie} />
          )): 
          <>
            <p className="text-white">You Don't Have Any Favorites.</p>
          </>
          }
          </div>
    </main>
    </div>
    )
}