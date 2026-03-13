"use client";
import { useProvider } from "@/store/Provider";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import "@/componnets/css/heart.css";

export default function Heart({ movieId, isComplete = false }) {
  const { isLoggedIn: isUserLoggedIn, user, setUser } = useProvider();
  const [disable, setDisable] = useState(false);
  const isFavorite = user?.favorites?.includes(movieId) || false;
  const favorites = user?.favorites || [];

  const handleClick = async (id) => {
    if (disable) return;
    try {
      setDisable(true);
      const isRemoving = favorites.includes(id);

      toast.loading(isRemoving ? "Removing from favorites..." : "Adding to favorites...", { id: "fav-action" });

      const response = await fetch(`/api/user/favorites/${user.id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteID: id,
          action: isRemoving ? "remove" : "add",
        })
      });

      if (response.status === 201) {
        const data = await response.json();
        setUser({ ...user, favorites: data.favorites });
        toast.success(isRemoving ? "Removed from favorites" : "Added to favorites!", { id: "fav-action" });
      } else {
        toast.error("Failed to update favorites", { id: "fav-action" });
      }

    } catch (error) {
      console.error("Favorite action error:", error);
      toast.error('Something went wrong', { id: "fav-action" });
    } finally {
      setDisable(false);
    }
  };
  if (!isUserLoggedIn) {
    return (
      <button
        onClick={() => toast.error("Please login to manage favorites")}
        className={isComplete
          ? "flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-white/20 text-white/50 cursor-not-allowed font-bold"
          : "heart-btn absolute top-3 right-3 bg-black/40 text-white/40 p-2 rounded-full cursor-not-allowed"
        }

      >
        <FaHeart size={16} />
        {isComplete && <span className="text-sm ml-2">Add To Favorites</span>}
      </button>
    );
  }

  if (!isComplete) {
    return (
      <button
        disabled={disable}
        onClick={() => handleClick(movieId)}
        className={`heart-btn absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all active:scale-75 shadow-lg z-30 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${isFavorite
          ? 'bg-blue-600 text-white shadow-blue-500/50 scale-110'
          : 'bg-black/40 text-white/70 hover:bg-blue-600/80 hover:text-white'
          }`}

      >
        <FaHeart size={18} />
      </button>
    );
  }

  return (
    <button
      disabled={disable}
      onClick={() => handleClick(movieId)}

      className={`flex items-center justify-center gap-3 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl min-w-[200px] border-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${isFavorite
        ? 'bg-transparent border-blue-600 text-blue-400 hover:bg-blue-600/10'
        : 'bg-transparent border-white text-white hover:bg-white/10'
        }`}
    >
      <FaHeart size={18} className={isFavorite ? 'text-blue-500' : ''} />
      <span className="text-sm">
        {isFavorite ? 'Remove From Favorites' : 'Add To Favorites'}
      </span>
    </button>
  );
}