import { getTvShowDetails, getImageUrl } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { StarIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { Suspense } from 'react';
import { RatingsDisplay } from '@/customComponents/ratings';

async function getTvShow(id: string) {
  const tvShow = await getTvShowDetails(id);
  return tvShow;
}

export default async function TvShowPage({
  params,
}: {
  params: { id: string };
}) {
  // Add type checking and error handling
  if (!params?.id) {
    throw new Error('TV Show ID is required');
  }

  const tvShow = await getTvShow(params.id);

  return (
    <main className='container mx-auto px-4 py-8 bg-gray-100/50'>
      <Link href='/'>
        <Button variant='outline' className='mb-6'>
          ← Back to Search
        </Button>
      </Link>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-8 bg-blue-300 rounded-2xl'>
        {/* Movie Poster */}
        <div className='md:col-span-1'>
          <div className='aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg max-w-[300px]'>
            {tvShow.poster_path ? (
              <Image
                src={
                  getImageUrl(tvShow.poster_path, 'w500') ||
                  '/fallback-image.jpg'
                }
                alt={tvShow.name}
                fill
                className='object-cover'
                priority
              />
            ) : (
              <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-500'>No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* TV Show Details */}
        <div className='md:col-span-2'>
          <h1 className='text-3xl font-bold mb-2'>{tvShow.name}</h1>

          {tvShow.tagline && (
            <p className='text-gray-500 italic mb-4'>{tvShow.tagline}</p>
          )}

          <div className='flex flex-wrap gap-4 mb-6'>
            <div className='flex items-center'>
              <StarIcon className='h-5 w-5 text-yellow-500 mr-1' />
              <span>{tvShow.vote_average?.toFixed(1)}/10</span>
              <span className='text-sm text-gray-500 ml-1'>
                ({tvShow.vote_count} votes)
              </span>
            </div>

            {tvShow.first_air_date && (
              <div className='flex items-center'>
                <CalendarIcon className='h-5 w-5 mr-1' />
                <span>
                  {new Date(tvShow.first_air_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {tvShow.episode_run_time && tvShow.episode_run_time[0] > 0 && (
              <div className='flex items-center'>
                <ClockIcon className='h-5 w-5 mr-1' />
                <span>{tvShow.episode_run_time[0]} min per episode</span>
              </div>
            )}
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2'>Overview</h2>
            <p className='text-gray-700'>{tvShow.overview}</p>
          </div>

          {tvShow.genres && tvShow.genres.length > 0 && (
            <div className='mb-6'>
              <h2 className='text-xl font-semibold mb-2'>Genres</h2>
              <div className='flex flex-wrap gap-2'>
                {tvShow.genres.map((genre: { id: number; name: string }) => (
                  <span
                    key={genre.id}
                    className='px-3 py-1 bg-slate-700 rounded-full text-sm text-white'>
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Move IMDb ratings outside of genres */}
          {tvShow.external_ids?.imdb_id && (
            <Suspense fallback={<div>Loading ratings...</div>}>
              <RatingsDisplay imdbId={tvShow.external_ids.imdb_id} />
            </Suspense>
          )}

          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2'>Show Info</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {tvShow.number_of_seasons && (
                <div>
                  <p className='text-sm text-gray-500'>Seasons</p>
                  <p>{tvShow.number_of_seasons}</p>
                </div>
              )}

              {tvShow.number_of_episodes && (
                <div>
                  <p className='text-sm text-gray-500'>Episodes</p>
                  <p>{tvShow.number_of_episodes}</p>
                </div>
              )}

              {tvShow.status && (
                <div>
                  <p className='text-sm text-gray-500'>Status</p>
                  <p>{tvShow.status}</p>
                </div>
              )}

              {tvShow.networks && tvShow.networks.length > 0 && (
                <div>
                  <p className='text-sm text-gray-500'>Network</p>
                  <p>
                    {tvShow.networks
                      .map((n: { name: string }) => n.name)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {tvShow.credits &&
        tvShow.credits.cast &&
        tvShow.credits.cast.length > 0 && (
          <section className='mt-12'>
            <h2 className='text-2xl font-semibold mb-6'>Cast</h2>
            <div className='grid grid-cols-2 gap-6'>
              {tvShow.credits.cast
                .slice(0, 12)
                .map(
                  (person: {
                    id: number;
                    profile_path: string;
                    name: string;
                    character: string;
                  }) => (
                    <div key={person.id} className='flex items-center gap-4'>
                      <div className='relative w-16 h-16 flex-shrink-0'>
                        {person.profile_path ? (
                          <Image
                            src={
                              getImageUrl(person.profile_path, 'w200') ||
                              '/fallback-image.jpg'
                            }
                            alt={person.name}
                            fill
                            className='object-cover rounded-full'
                          />
                        ) : (
                          <div className='w-full h-full bg-gray-200 rounded-full flex items-center justify-center'>
                            <span className='text-xs text-gray-500'>
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className='font-semibold'>{person.name}</h3>
                        <p className='text-gray-500'>{person.character}</p>
                      </div>
                    </div>
                  )
                )}
            </div>
          </section>
        )}

      {/* Reviews Section */}
      {tvShow.reviews &&
        tvShow.reviews.results &&
        tvShow.reviews.results.length > 0 && (
          <section className='mt-12'>
            <h2 className='text-2xl font-semibold mb-6'>Reviews</h2>
            <div className='space-y-6'>
              {tvShow.reviews.results.map(
                (review: {
                  id: string;
                  author: string;
                  content: string;
                  created_at: string;
                  author_details?: {
                    rating?: number;
                    avatar_path?: string;
                  };
                }) => (
                  <div
                    key={review.id}
                    className='bg-gray-200/70 rounded-lg p-6 shadow-sm'>
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='relative w-12 h-12 flex-shrink-0'>
                        {review.author_details?.avatar_path ? (
                          <Image
                            src={
                              getImageUrl(
                                review.author_details.avatar_path,
                                'w200'
                              ) || '/fallback-avatar.png'
                            }
                            alt={review.author}
                            fill
                            className='object-cover rounded-full'
                          />
                        ) : (
                          <div className='w-full h-full bg-gray-200 rounded-full flex items-center justify-center'>
                            <span className='text-xl text-gray-500'>
                              {review.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className='font-semibold'>{review.author}</h3>
                        <p className='text-sm text-gray-500'>
                          {new Date(review.created_at).toLocaleDateString()}
                          {review.author_details?.rating &&
                            ` • Rating: ${review.author_details.rating}/10`}
                        </p>
                      </div>
                    </div>
                    <p className='text-gray-700 whitespace-pre-line'>
                      {review.content}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}
    </main>
  );
}
