/* eslint-disable @typescript-eslint/no-explicit-any */
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

export type ExternalRatings = {
  imdbRating: string;
  imdbVotes: string;
  rottenTomatoesRating?: string;
  metascore?: string;
};

export async function getMovieRatings(
  imdbId: string
): Promise<ExternalRatings | null> {
  if (!imdbId) return null;

  try {
    const response = await fetch(
      `${BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`,
      { next: { revalidate: 24 * 60 * 60 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error('Failed to fetch OMDb data');
    }

    const data = await response.json();

    // Extract Rotten Tomatoes rating if available
    let rottenTomatoesRating = undefined;
    if (data.Ratings) {
      const rtRating = data.Ratings.find(
        (rating: any) => rating.Source === 'Rotten Tomatoes'
      );
      if (rtRating) {
        rottenTomatoesRating = rtRating.Value;
      }
    }

    return {
      imdbRating: data.imdbRating,
      imdbVotes: data.imdbVotes,
      rottenTomatoesRating,
      metascore: data.Metascore,
    };
  } catch (error) {
    console.error('Error fetching OMDb data:', error);
    return null;
  }
}
