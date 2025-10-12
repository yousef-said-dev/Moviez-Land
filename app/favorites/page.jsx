"use client";
import { APIRequests } from "@/store/api";
import SearchBar from "@/componnets/searchBar";
import Card from "@/componnets/card";
import Link from "next/link";
import { useProvider } from "@/store/Provider";
import { useEffect, useState } from "react";
import { APIRequests } from "@/store/api";
export default  function Favorites(){
  const {user, isLoggedIn} = useProvider();
  const [favorites,setFavorites] = useState([])
  console.log(isLoggedIn);
  if(!isLoggedIn){
    console.log('dsa');
    return(
      <p className="text-3xl text-center mt-100 font-bold text-blue-500">Yor Should <Link href="/login" className="text-blue-600 hover:text-blue-400">Login</Link> to See Favorites.</p>
    )
  }
  try{
        APIRequests.getFavorites(user.id).then((data)=>{
          console.log(data);
          setFavorites(data.favorites);
        }
  } catch(err){
  }
    
    
    return (
  <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
   
        <div className="flex flex-wrap gap-10 justify-center">
          {favorites?.map((movie)=> ( 
            <Card key={movie.id} {...movie} />
          ))}
          </div>
    </main>
    </div>
    )
}
