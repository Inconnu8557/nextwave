import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  type: 'post' | 'community';
}

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults, isLoading } = useQuery<SearchResult[]>({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      // Rechercher dans les posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title')
        .textSearch('title', searchQuery)
        .limit(5);

      // Rechercher dans les communautés
      const { data: communitiesData, error: communitiesError } = await supabase
        .from('communities')
        .select('id, name')
        .textSearch('name', searchQuery)
        .limit(5);

      if (postsError || communitiesError) {
        console.error('Erreur de recherche:', postsError || communitiesError);
        return [];
      }

      // Combiner et formater les résultats
      const formattedPosts = (postsData || []).map(post => ({
        ...post,
        type: 'post' as const
      }));

      const formattedCommunities = (communitiesData || []).map(community => ({
        ...community,
        type: 'community' as const
      }));

      return [...formattedPosts, ...formattedCommunities];
    },
    enabled: searchQuery.length > 2,
  });

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher des posts..."
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
      {searchQuery.length > 2 && (
        <div className="absolute z-50 w-full mt-2 overflow-hidden bg-gray-800 border rounded-lg shadow-xl border-white/10">
          {isLoading ? (
            <div className="p-4 text-gray-400">Recherche en cours...</div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.type === 'post' ? `/post/${result.id}` : `/community/${result.id}`}
                  className="flex items-center px-4 py-3 transition-colors hover:bg-gray-700"
                >
                  <div className="flex-1">
                    <div className="text-gray-200">
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