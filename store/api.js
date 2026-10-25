import { getBaseUrl } from "@/utils/baseUrl";

const getTmdbBaseUrl = () =>
  process.env.TMDB_BASE_URL ||
  process.env.NEXT_PUBLIC_TMDB_BASE_URL ||
  "https://api.themoviedb.org/3";

const getTmdbToken = () =>
  process.env.TMDB_API_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN;

const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
  const absoluteUrl = (url.startsWith("/") && typeof window === "undefined") 
    ? `${getBaseUrl()}${url}` 
    : url;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(absoluteUrl, {
      ...options,
      signal: options.signal || controller.signal
    });
    clearTimeout(id);

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    return { ...data, status: response.status, ok: response.ok };

  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      return { status: 408, ok: false, error: "Request took too long. Please check your internet connection." };
    }
    return { status: 0, ok: false, error: "Network error occurred. Please check your connection." };
  }
};

export const APIRequests = {
  movies: async (pageNumber = 1, filters = {}) => {
    const { genres, sort } = filters;
    const baseUrl = getTmdbBaseUrl();
    const token = getTmdbToken();
    let url = `${baseUrl}/discover/movie?include_adult=false&include_video=true&language=en-US&page=${pageNumber}`;

    url += `&sort_by=${sort || 'popularity.desc'}`;

    if (genres && genres.length > 0) {
      url += `&with_genres=${genres}`;
    }

    return await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    });
  },
  movie: async (id) => {
    if (!id) return [null, null];
    const baseUrl = getTmdbBaseUrl();
    const token = getTmdbToken();

    const [data, trailer] = await Promise.all([
      fetchWithTimeout(`${baseUrl}/movie/${id}?language=en-US`, {
        method: "GET",
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        next: { revalidate: 86400 }
      }),
      fetchWithTimeout(`${baseUrl}/movie/${id}/videos`, {
        method: "GET",
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        next: { revalidate: 86400 }
      })
    ]);

    const trailerKey = trailer?.results && trailer?.results?.length > 0 ? trailer?.results[0].key : 'no-key';
    const trailerPath = trailerKey !== 'no-key' ? `https://www.youtube.com/embed/${trailerKey}?controls=0` : null;
    return [data, trailerPath];
  },
  search: async (query, pageNumber = 1) => {
    if (!query || !query.trim()) {
      return { results: [], page: 1, total_pages: 0, total_results: 0, status: 200, ok: true };
    }
    const cleanQuery = query.trim();
    const baseUrl = getTmdbBaseUrl();
    const token = getTmdbToken();
    return await fetchWithTimeout(`${baseUrl}/search/movie?query=${encodeURIComponent(cleanQuery)}&include_adult=false&language=en-US&page=${pageNumber}`, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 300 }
    });
  },
  trending: async (pageNumber = 1, filters = {}) => {
    const { genres, year, rating, sort } = filters;
    const baseUrl = getTmdbBaseUrl();
    const token = getTmdbToken();
    let url = `${baseUrl}/trending/movie/day?language=en-US&page=${pageNumber}`;

    if (genres || year || rating || (sort && sort !== 'popularity.desc')) {
      url = `${baseUrl}/discover/movie?include_adult=false&language=en-US&page=${pageNumber}`;
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
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    });
  },
  getFavorites: async (userId) => {
    return await fetchWithTimeout(`/api/user/favorites/${userId}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store"
    });
  },
  UpdateProfile: async (userId, data) => {
    return await fetchWithTimeout(`/api/user/profile/${userId}`, {
      method: "PUT",
      body: data,
      headers: {},
      cache: "no-store"
    }, 60000);
  },
  similar: async (id) => {
    if (!id) return { results: [], status: 400, ok: false };
    const baseUrl = getTmdbBaseUrl();
    const token = getTmdbToken();
    return await fetchWithTimeout(`${baseUrl}/movie/${id}/similar?language=en-US`, {
      method: "GET",
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 86400 }
    });
  },
};



