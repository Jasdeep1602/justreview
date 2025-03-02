'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { getImageUrl } from '@/lib/tmdb';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

type CategoryCount = {
  movies: number;
  tv: number;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [counts, setCounts] = useState<CategoryCount>({
    movies: 0,
    tv: 0,
  });

  const categories = [
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
  ];

  const searchAll = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/tmdb/search/multi?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      setResults(data.results || []);

      const countData = {
        movies: data.results.filter(
          (item: SearchResult) => item.media_type === 'movie'
        ).length,
        tv: data.results.filter(
          (item: SearchResult) => item.media_type === 'tv'
        ).length,
      };

      setCounts(countData);

      if (!activeCategory) {
        if (countData.movies > 0) setActiveCategory('movies');
        else if (countData.tv > 0) setActiveCategory('tv');
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory]);

  const searchByCategory = async (category: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setActiveCategory(category);

    try {
      let endpoint = '';

      switch (category) {
        case 'movies':
          endpoint = '/api/tmdb/search/movies';
          break;
        case 'tv':
          endpoint = '/api/tmdb/search/tv';
          break;

        default:
          // Fallback to multi search for other categories
          endpoint = '/api/tmdb/search/multi';
      }

      const res = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      // Map the results to the appropriate media type if it's not already set
      const formattedResults = data.results.map((item: any) => ({
        ...item,
        media_type:
          category === 'movies'
            ? 'movie'
            : category === 'tv'
            ? 'tv'
            : category === 'people'
            ? 'person'
            : item.media_type,
      }));

      setResults(formattedResults || []);
    } catch (error) {
      console.error(`Error searching ${category}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setActiveCategory(null);
    setCounts({ movies: 0, tv: 0 });
  };

  const getTitle = (item: SearchResult) => {
    return item.title || item.name || 'Unknown Title';
  };

  const getImagePath = (item: SearchResult) => {
    if (item.poster_path) return getImageUrl(item.poster_path);
    if (item.profile_path) return getImageUrl(item.profile_path);
    return null;
  };

  const getYear = (item: SearchResult) => {
    if (item.release_date) return item.release_date.split('-')[0];
    if (item.first_air_date) return item.first_air_date.split('-')[0];
    return 'N/A';
  };

  const getDetailUrl = (item: SearchResult) => {
    const mediaType = item.media_type || 'movie';
    return `/${mediaType}/${item.id}`;
  };

  const renderCategoryCount = (category: string) => {
    const categoryKey = category.toLowerCase() as keyof CategoryCount;
    return counts[categoryKey] || 0;
  };

  const filteredResults = activeCategory
    ? results.filter((item) => {
        if (activeCategory === 'movies') return item.media_type === 'movie';
        if (activeCategory === 'tv') return item.media_type === 'tv';
        return true;
      })
    : results;

  return (
    <main className='container mx-auto px-4 py-4'>
      <div className='relative mb-8'>
        <div className='flex items-center border border-gray-300 rounded-md overflow-hidden'>
          <div className='pl-3 pr-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <Input
            placeholder='Search for a movie or tv show...'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === '') {
                setResults([]);
                setActiveCategory(null);
                setCounts({ movies: 0, tv: 0 });
              }
            }}
            className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          {query && (
            <button onClick={clearSearch} className='pr-3 pl-2'>
              <X className='h-5 w-5 text-gray-500' />
            </button>
          )}
          <button
            onClick={searchAll}
            className='px-4 py-2 bg-blue-400 text-white hover:bg-blue-600 transition-colors'>
            Search
          </button>
        </div>
      </div>

      {!query && (
        <div className=' flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]'>
          <div className='absolute inset-0 -z-10'>
            <Image
              src='/rows-red-seats-theater.jpg'
              alt='Movie background'
              fill
              className='object-cover opacity-40'
              priority
            />
          </div>

          <Image
            src='/reviewLogoR.png'
            alt='Movie background'
            className='opacity-70'
            width={150}
            height={150}
          />
        </div>
      )}

      {query && results.length > 0 && (
        <div className=' bg-gray-100/50 grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Categories Sidebar */}
          <div className='md:col-span-1'>
            <div className='bg-blue-400 text-white p-4 rounded-t-md'>
              <h2 className='text-lg font-medium'>Search Results</h2>
            </div>
            <div className='border border-gray-200 border-t-0 rounded-b-md'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => searchByCategory(category.id)}
                  className={` cursor-pointer w-full flex justify-between items-center p-4 hover:bg-gray-100 border-b border-gray-200 ${
                    activeCategory === category.id ? 'bg-gray-100' : ''
                  }`}>
                  <span>{category.label}</span>
                  <span className='bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md'>
                    {renderCategoryCount(category.id)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className='md:col-span-3 bg-gray-100/50'>
            <div className='grid grid-cols-1 gap-4'>
              {filteredResults.map((item) => (
                <Link
                  href={getDetailUrl(item)}
                  key={`${item.media_type}-${item.id}`}>
                  <div className='flex border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow bg-slate-100'>
                    <div className='w-24 h-36 relative flex-shrink-0 bg-gray-100'>
                      {getImagePath(item) ? (
                        <Image
                          src={getImagePath(item)!}
                          alt={getTitle(item)}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <span className='text-gray-400 text-xs text-center'>
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='p-4'>
                      <h3 className='font-semibold'>{getTitle(item)}</h3>
                      <p className='text-sm text-gray-500'>{getYear(item)}</p>
                      {item.media_type === 'movie' && (
                        <span className='inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                          Movie
                        </span>
                      )}
                      {item.media_type === 'tv' && (
                        <span className='inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                          TV Show
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {filteredResults.length && (
                <div className='text-center py-8 text-gray-800'>
                  No results found in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className='text-center py-8'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500'></div>
          <p className='mt-2 text-gray-600'>Loading results...</p>
        </div>
      )}
    </main>
  );
}
