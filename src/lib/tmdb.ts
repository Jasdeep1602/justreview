const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export async function searchMulti(query: string) {
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&language=en-US&page=1&include_adult=false`,
    { next: { revalidate: 60 * 60 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  return response.json();
}

export async function searchMovies(query: string) {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&language=en-US&page=1&include_adult=false`,
    { next: { revalidate: 60 * 60 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }

  return response.json();
}

export async function searchTvShows(query: string) {
  const response = await fetch(
    `${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&language=en-US&page=1&include_adult=false`,
    { next: { revalidate: 60 * 60 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error('Failed to fetch TV shows');
  }

  return response.json();
}

export async function getMovieDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,reviews`,
    { next: { revalidate: 24 * 60 * 60 } } // Cache for 24 hours
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
}

export async function getTvShowDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,reviews,external_ids`,
    { next: { revalidate: 24 * 60 * 60 } } // Cache for 24 hours
  );

  if (!response.ok) {
    throw new Error('Failed to fetch TV show details');
  }

  return response.json();
}

export function getImageUrl(
  path: string,
  size: 'w500' | 'original' | 'w200' = 'w500'
) {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}
