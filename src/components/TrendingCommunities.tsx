import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';
import { Flame, Users, TrendingUp } from 'lucide-react';

interface Community {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  member_count: number;
}

const fetchTrendingCommunities = async (): Promise<Community[]> => {
  // First, get communities
  const { data: communities, error: communitiesError } = await supabase
    .from('communities')
    .select('id, name, description, created_at')
    .order('created_at', { ascending: false })
    .limit(4);

  if (communitiesError || !communities) {
    console.error('Erreur lors de la récupération des communautés:', communitiesError);
    return [];
  }

  // Then, get member counts for each community (count unique authors who posted)
  const communitiesWithCounts = await Promise.all(
    communities.map(async (community) => {
      const { data: posts, error: countError } = await supabase
        .from('posts')
        .select('author_id')
        .eq('community_id', community.id);

      if (countError) {
        console.error(`Erreur lors du comptage des membres pour la communauté ${community.id}:`, countError);
      }

      // Count unique authors (members)
      const uniqueAuthors = new Set(posts?.map(post => post.author_id) || []);
      const member_count = uniqueAuthors.size;

      return {
        ...community,
        member_count
      };
    })
  );

  return communitiesWithCounts;
};

export const TrendingCommunities = () => {
  const { data: communities, isLoading, error } = useQuery({
    queryKey: ['trending-communities'],
    queryFn: fetchTrendingCommunities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getRandomGrowth = () => {
    const growth = Math.floor(Math.random() * 20) + 1;
    return `+${growth}%`;
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getCommunityInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="card-base p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Communautés tendances
        </h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg" />
                  <div>
                    <div className="h-4 bg-slate-700 rounded w-24 mb-1" />
                    <div className="h-3 bg-slate-700 rounded w-16" />
                  </div>
                </div>
                <div className="h-3 w-8 bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !communities || communities.length === 0) {
    return (
      <div className="card-base p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Communautés tendances
        </h3>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-4">
            {error ? 'Erreur lors du chargement' : 'Aucune communauté trouvée'}
          </p>
          <Link to="/community/create" className="btn-primary text-sm">
            Créer la première
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400" />
        Communautés tendances
      </h3>
      
      <div className="space-y-3">
        {communities.map((community, index) => {
          const growth = getRandomGrowth();
          
          return (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {getCommunityInitials(community.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                    {community.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatMemberCount(community.member_count)} membres
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">
                  {growth}
                </span>
              </div>
            </Link>
          );
        })}
        
        <Link 
          to="/communities" 
          className="block w-full text-center py-3 text-blue-400 hover:text-blue-300 font-medium transition-colors border-t border-slate-700/50 mt-4 pt-4"
        >
          Voir toutes les communautés
        </Link>
      </div>
    </div>
  );
};
