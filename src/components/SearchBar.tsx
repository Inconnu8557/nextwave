import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce'; // npm install lodash.debounce

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  type: 'post' | 'community';
}

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce input value
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  // Detect clicks outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch data from Supabase
  const { data: searchResults, isLoading } = useQuery<SearchResult[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];

      const [posts, communities] = await Promise.all([
        supabase
          .from('posts')
          .select('id, title')
          .ilike('title', `%${debouncedQuery}%`)
          .limit(5),
        supabase
          .from('communities')
          .select('id, name')
          .ilike('name', `%${debouncedQuery}%`)
          .limit(5),
      ]);

      if (posts.error || communities.error) {
        console.error('Erreur:', posts.error || communities.error);
        return [];
      }

      const formattedPosts = (posts.data || []).map(post => ({
        ...post,
        type: 'post' as const,
      }));

      const formattedCommunities = (communities.data || []).map(comm => ({
        ...comm,
        type: 'community' as const,
      }));

      return [...formattedPosts, ...formattedCommunities];
    },
    enabled: debouncedQuery.length > 2,
    staleTime: 60 * 1000,
  });

  return (
    <div ref={wrapperRef} className="relative">
      {/* Input de recherche */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Rechercher des posts ou communautés..."
          className="w-full px-4 py-2 pl-10 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <svg
          className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Résultats de recherche */}
      {debouncedQuery.length > 2 && isFocused && (
        <div className="absolute z-50 w-full mt-2 overflow-hidden bg-gray-800 border rounded-lg shadow-xl border-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-gray-400">
              <motion.div
                className="w-6 h-6 border-4 border-purple-500 rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
              />
              <span className="ml-3">Recherche en cours...</span>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-2 overflow-y-auto max-h-60">
              {searchResults.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.type === 'post' ? `/post/${result.id}` : `/community/${result.id}`}
                  className="flex items-start px-4 py-3 transition-colors hover:bg-gray-700"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-200 truncate">
                      {result.type === 'post' ? result.title : result.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {result.type === 'post' ? 'Post' : 'Communauté'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-gray-400">Aucun résultat trouvé</div>
          )}
        </div>
      )}
    </div>
  );
};
  