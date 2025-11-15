"use client";
import { useProvider } from "@/store/Provider";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
export default function Heart({ movieId }) {
    const { isLoggedIn, user} = useProvider();
    const [isFavorite, setIsFavorite] = useState(user?.favorites?.includes(movieId) || false);
    const [favorites, setFavorites] = useState(user?.favorites || []);
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
        body:JSON.stringify({
          favoriteID: id,
          action: "remove",
        })
      });
  
      if (response.status === 201) {
        const data = await response.json();
        console.log("Updated favorites:", data);
        setIsFavorite(data.favorites.includes(movieId));
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
        body:JSON.stringify({
          favoriteID: id,
          action: "add",
        })
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log("Updated favorites:", data);
        setIsFavorite(data.favorites.includes(movieId));
        setFavorites(data.favorites);
        user.favorites = data.favorites;
      }
    }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };
  console.log(favorites);
    if (!isLoggedIn) {
          return;
        }else {
              return(
                <button
        onClick={()=>{
          handleClick(movieId)
        }}
        className={`absolute top-3 right-3 bg-black/70 hover:bg-blue-600 ${isFavorite ? 'text-blue-800' : 'text-white'} hover:cursor-pointer transition-colors p-2 rounded-full`}>
          <FaHeart size={16} />
        </button>
              )

}
}