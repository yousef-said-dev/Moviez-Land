
export const APIRequests = {
    movies:async ()=>{
    const data = await fetch(`${process.env.TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,{
    method:"GET",
    headers:{
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`

    },
  })
  return await data.json()

},
 movie:async (id)=>{
    const data = await fetch(`${process.env.TMDB_BASE_URL}/movie/${id}?language=en-US`,{
    method:"GET",
    headers:{
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`

    },
  })
    const trailer = await fetch(`${process.env.TMDB_BASE_URL}/movie/${id}/videos`,{
    method:"GET",
    headers:{
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`

    },
  })

  let key = await trailer.json();
  key = key.results[0].key;
  console.log(key);
  console.log('Trailer : '+ {trailer});
  const trailerPath = `https://www.youtube.com/embed/${key}?controls=0`;
  return  [await data.json() , trailerPath];

},
 search:async (query)=>{
    const data = await fetch(`${process.env.TMDB_BASE_URL}/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,{
    method:"GET",
    headers:{
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`

    },
  })
  return await data.json()
  
},
 trending:async ()=>{
    const data = await fetch(`${process.env.TMDB_BASE_URL}/trending/movie/day?language=en-US`,{
    method:"GET",
    headers:{
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`

    },
  })
  return await data.json()

},
 getFavorites:async (userId)=>{
  const data = await fetch(`/api/user/favorites/${userId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      })
    return await data.json();
},
}

 
  