"use client";
import { useProvider } from "@/store/Provider";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { APIRequests } from "@/store/api";
import Provider from "@/store/Provider";
function  Card({ ...movie }) {
   const { isLoggedIn, user } = useProvider();
   const [isFavorite, setIsFavorite] = useState(false);
   const [favorites, setFavorites] = useState([]);
  useEffect(()=>{
  console.log(isLoggedIn);
  if(isLoggedIn){
    console.log('logged in');
    setFavorites(user.favorites);
      user.favorites.includes(movie.id)?setIsFavorite(true):setIsFavorite(false);   
      };
      console.log("Fetching favorites...");
  },[])
  const handleClick = async (id) => {
    try {
      if(favorites.includes(id)){
        console.log(favorites);
        console.log("Removing favorite:", id);
        setIsFavorite(false);
        
        const response = await fetch(`/api/user/favorites/${user.id}`, {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteID: id,
          action: "remove",
        })
      });
  
      if (response.status === 201) {
        const data = await response.json();
        console.log("Updated favorites:", data);
        setIsFavorite(data.favorites.includes(movie.id));
        setFavorites(data.favorites);
        user.favorites = data.favorites;
      }
      }
      else{
        console.log("Adding favorite:", id);
        setIsFavorite(true);
        const response = await fetch(`/api/user/favorites/${user.id}`, {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteID: id,
          action:"add",
        })
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log("Updated favorites:", data);
        setIsFavorite(data.favorites.includes(movie.id));
        setFavorites(data.favorites);
        user.favorites = data.favorites;
      }
    }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };
  console.log(favorites);
  return (
    <div className="relative group w-[220px] h-[330px] rounded-2xl overflow-hidden shadow-lg shadow-black/50 mx-4 my-6">
      <Link href={`/movie/${movie.id}`}>
        <Image
          src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover transition-transform  duration-300 hover:scale-110"
        />
      </Link>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-3">
        <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
        <div className="flex items-center gap-2 text-yellow-400 text-xs">
          <FaStar />
          <span className="text-white">{movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>

      {isLoggedIn && (
        <button
        onClick={()=>{
          handleClick(movie.id)
        }}
        className={`absolute top-3 right-3 bg-black/70 hover:bg-blue-600 ${isFavorite ? 'text-blue-800' : 'text-white'} hover:cursor-pointer transition-colors p-2 rounded-full`}>
          <FaHeart size={16} />
        </button>
      )}
    </div>
  );
}

export default Card;
