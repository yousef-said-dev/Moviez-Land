
import { getBaseUrl } from "@/utils/baseUrl";

const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
  const absoluteUrl = (url.startsWith("/") && typeof window === "undefined") 
    ? `${getBaseUrl()}${url}` 
    : url;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(absoluteUrl, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }
    return { ...data, status: response.status };

  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      return { status: 408, error: "Request took too long. Please check your internet connection." };
    }
    return { status: 0, error: "Network error occurred. Please check your connection." };
  }
}

export const APIRequests = {
  movies: async (pageNumber = 1, filters = {}) => {
    const { genres, sort } = filters;
    let url = `${process.env.TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=${pageNumber}`;

    url += `&sort_by=${sort || 'popularity.desc'}`;

    if (genres && genres.length > 0) {
      url += `&with_genres=${genres}`;
    }


    return await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      },
    })
  },
  movie: async (id) => {
    const data = await fetchWithTimeout(`${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}?language=en-US`, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
      },
    })
    const trailer = await fetchWithTimeout(`${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}/videos`, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`

      },
    })
    const trailerKey = trailer?.results && trailer?.results?.length > 0 ? trailer?.results[0].key : 'no-key';
    const trailerPath = trailerKey !== 'no-key' ? `https://www.youtube.com/embed/${trailerKey}?controls=0` : null;
    return [data, trailerPath];

  },
  search: async (query, pageNumber = 1) => {
    return await fetchWithTimeout(`${process.env.TMDB_BASE_URL}/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      },
    })
  },
  trending: async (pageNumber = 1, filters = {}) => {
    const { genres, year, rating, sort } = filters;
    let url = `${process.env.TMDB_BASE_URL}/trending/movie/day?language=en-US&page=${pageNumber}`;

    if (genres || year || rating || (sort && sort !== 'popularity.desc')) {
      url = `${process.env.TMDB_BASE_URL}/discover/movie?include_adult=false&language=en-US&page=${pageNumber}`;
      url += `&sort_by=${sort || 'popularity.desc'}`;

      if (genres && genres.length > 0) {
        url += `&with_genres=${genres}`;
      }

      if (year) {
        url += `&primary_release_year=${year}`;
      }

      if (rating) {
        url += `&vote_average.gte=${rating}`;
      }
    }

    return await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      },
    })
  },
  getFavorites: async (userId) => {
    return await fetchWithTimeout(`/api/user/favorites/${userId}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    })
  },
  UpdateProfile: async (userId, data) => {

    return await fetchWithTimeout(`/api/user/profile/${userId}`, {
      method: "PUT",
      body: data,
      headers: {
      }
    }, 60000)
  },
  similar: async (id) => {
    return await fetchWithTimeout(`${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}/similar?language=en-US`, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
      },
    })
  },
}


