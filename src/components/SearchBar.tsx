import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import debounce from 'lodash.debounce';
import { Search, Hash, User, Loader2, Command } from 'lucide-react';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  type: 'post' | 'community' | 'user';
  avatar_url?: string;
  excerpt?: string;
}

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(searchQuery.trim());
      setSelectedIndex(0);
    }, 200);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  // Enhanced search with multiple data sources
  const { data: searchResults, isLoading } = useQuery<SearchResult[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];

      const [posts, communities] = await Promise.all([
        supabase
          .from('posts')
          .select('id, title, content')
          .or(`title.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`)
          .limit(4),
        supabase
          .from('communities')
          .select('id, name, description')
          .ilike('name', `%${debouncedQuery}%`)
          .limit(3),
      ]);

      if (posts.error || communities.error) {
        console.error('Erreur de recherche:', posts.error || communities.error);
        return [];
      }

      const formattedPosts = (posts.data || []).map(post => ({
        ...post,
        type: 'post' as const,
        excerpt: post.content?.substring(0, 80) + '...'
      }));

      const formattedCommunities = (communities.data || []).map(comm => ({
        ...comm,
        title: comm.name,
        type: 'community' as const,
        excerpt: comm.description?.substring(0, 80) + '...'
      }));

      return [...formattedPosts, ...formattedCommunities];
    },
    enabled: debouncedQuery.length > 1,
    staleTime: 30 * 1000,
  });

  // Navigation au clavier avec les résultats - optimisé avec useCallback
  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (!isFocused) return;

    switch (event.key) {
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < (searchResults?.length || 0) - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        event.preventDefault();
        if (searchResults?.[selectedIndex]) {
          const result = searchResults[selectedIndex];
          const path = result.type === 'post' 
            ? `/post/${result.id}` 
            : result.type === 'community'
            ? `/community/${result.id}`
            : `/user/${result.id}`;
          window.location.href = path;
        }
        break;
    }
  }, [isFocused, searchResults, selectedIndex]);

  // Global shortcuts and click outside
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Global search shortcut (Cmd/Ctrl + K)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
        return;
      }

      // Handle navigation
      handleKeyNavigation(event);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleKeyNavigation]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'post': return <Hash className="w-4 h-4 text-blue-400" />;
      case 'community': return <User className="w-4 h-4 text-purple-400" />;
      default: return <User className="w-4 h-4 text-green-400" />;
    }
  };

  const getResultLabel = (type: string) => {
    switch (type) {
      case 'post': return 'Post';
      case 'community': return 'Communauté';
      default: return 'Utilisateur';
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Rechercher posts, communautés..."
          className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
        />
        
        {/* Keyboard shortcut hint */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-slate-500 bg-slate-700/50 rounded border border-slate-600">
            <Command className="w-3 h-3" />
            K
          </kbd>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Quick suggestions if no query */}
            {!debouncedQuery && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Recherches populaires</h3>
                <div className="space-y-2">
                  {['React', 'TypeScript', 'Open Source', 'WebDev', 'AI'].map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-left"
                    >
                      <Hash className="w-4 h-4" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {debouncedQuery && (
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400 mr-3" />
                    <span className="text-slate-400">Recherche en cours...</span>
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Résultats pour "{debouncedQuery}"
                    </div>
                    {searchResults.map((result, index) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        to={result.type === 'post' ? `/post/${result.id}` : `/community/${result.id}`}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                          index === selectedIndex ? 'bg-slate-700' : 'hover:bg-slate-700/50'
                        }`}
                        onClick={() => setIsFocused(false)}
                      >
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">
                            {result.type === 'post' ? result.title : result.name}
                          </div>
                          {result.excerpt && (
                            <div className="text-sm text-slate-400 line-clamp-2 mt-1">
                              {result.excerpt}
                            </div>
                          )}
                          <div className="text-xs text-slate-500 mt-1">
                            {getResultLabel(result.type)}
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    {/* View all results */}
                    <div className="border-t border-slate-700 mt-2 pt-2">
                      <Link
                        to={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 transition-colors font-medium"
                        onClick={() => setIsFocused(false)}
                      >
                        <Search className="w-4 h-4" />
                        Voir tous les résultats
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Search className="w-8 h-8 text-slate-500 mb-3" />
                    <div className="text-slate-400 font-medium mb-1">Aucun résultat</div>
                    <div className="text-sm text-slate-500">Essayez d'autres mots-clés</div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
  