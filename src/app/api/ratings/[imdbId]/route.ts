import { getMovieRatings } from '@/lib/omdb';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  context: { params: { imdbId: string } }
) {
  const imdbId = context.params.imdbId;

  if (!imdbId) {
    return NextResponse.json({ error: 'IMDb ID is required' }, { status: 400 });
  }

  try {
    const ratings = await getMovieRatings(imdbId);
    return NextResponse.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}
