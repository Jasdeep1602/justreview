'use client';
import { ExternalRatings } from '@/lib/omdb';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function RatingsDisplay({ imdbId }: { imdbId: string }) {
  const [ratings, setRatings] = useState<ExternalRatings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imdbId) {
      setLoading(false);
      return;
    }

    async function fetchRatings() {
      try {
        const res = await fetch(`/api/ratings/${imdbId}`);
        const data = await res.json();
        setRatings(data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [imdbId]);

  if (loading) return <div className='mt-4'>Loading ratings...</div>;
  if (!ratings) return null;

  return (
    <div className='mt-6 space-y-2'>
      <h2 className=' text-sm font-semibold'>Ratings</h2>
      <div className='flex flex-wrap gap-4 '>
        {ratings.imdbRating && (
          <>
            <Image src='/imdb.png' alt='IMDb logo' width={40} height={20} />
            <div className='flex items-center  text-yellow-800'>
              <span>{ratings.imdbRating}/10</span>
              <span className='text-xs ml-1'>({ratings.imdbVotes} votes)</span>
            </div>
          </>
        )}

        {ratings.rottenTomatoesRating && (
          <>
            {' '}
            <Image
              src='/64px-Rotten_Tomatoes_alternative_logo.svg.png'
              alt='IMDb logo'
              width={40}
              height={20}
            />
            <div className='flex items-center  text-red-600'>
              {ratings.rottenTomatoesRating}
            </div>
          </>
        )}

        {ratings.metascore && ratings.metascore !== 'N/A' && (
          <div className='flex items-center gap-1'>
            <Image
              src='/icons8-metascore-48.png'
              alt='IMDb logo'
              width={40}
              height={20}
            />

            <div className='flex items-center  text-green-600'>
              {ratings.metascore}/100
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
