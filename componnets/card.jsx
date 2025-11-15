"use client";
import Heart from "./Heart";
import { useProvider } from "@/store/Provider";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { APIRequests } from "@/store/api";
import Provider from "@/store/Provider";
function  Card({ ...movie }) {
  if(movie.poster_path == null || movie.poster_path == undefined || movie.poster_path == '' ){
    var imageUrl = 'https://placehold.co/400x800';
  } else {
    var imageUrl = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
  }
  console.log(movie.title+imageUrl);
  return (
    <div className="relative group w-[220px] h-[330px] rounded-2xl overflow-hidden shadow-lg shadow-black/50 mx-4 my-6">
      <Link href={`/movie/${movie.id}`}>
        <Image
          src={imageUrl}
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

      {/* Favorite Icon */}
      <Heart movieId={movie.id}/>
    </div>
  );
}

export default Card;
