import { getTvShowDetails } from '@/lib/tmdb';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const data = await getTvShowDetails(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV show details' },
      { status: 500 }
    );
  }
}
