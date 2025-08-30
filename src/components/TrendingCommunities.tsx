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
      <div className="p-6 card-base">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
          <Flame className="w-5 h-5 text-orange-400" />
          Communautés tendances
        </h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700" />
                  <div>
                    <div className="w-24 h-4 mb-1 rounded bg-slate-700" />
                    <div className="w-16 h-3 rounded bg-slate-700" />
                  </div>
                </div>
                <div className="w-8 h-3 rounded bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !communities || communities.length === 0) {
    return (
      <div className="p-6 card-base">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
          <Flame className="w-5 h-5 text-orange-400" />
          Communautés tendances
        </h3>
        <div className="py-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-500" />
          <p className="mb-4 text-sm text-slate-400">
            {error ? 'Erreur lors du chargement' : 'Aucune communauté trouvée'}
          </p>
          <Link to="/community/create" className="text-sm btn-primary">
            Créer la première
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 card-base">
      <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
        <Flame className="w-5 h-5 text-orange-400" />
        Communautés tendances
      </h3>
      
      <div className="space-y-3">
        {communities.map((community) => {
          const growth = getRandomGrowth();
          
          return (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="flex items-center justify-between p-3 transition-colors rounded-lg cursor-pointer hover:bg-slate-800/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  {getCommunityInitials(community.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate transition-colors group-hover:text-blue-300">
                    {community.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatMemberCount(community.member_count)} membres
                  </div>
                </div>
              </div>
              <div className="flex items-center flex-shrink-0 gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs font-medium text-green-400">
                  {growth}
                </span>
              </div>
            </Link>
          );
        })}
        
        <Link 
          to="/communities" 
          className="block w-full py-3 pt-4 mt-4 font-medium text-center text-blue-400 transition-colors border-t hover:text-blue-300 border-slate-700/50"
        >
          Voir toutes les communautés
        </Link>
      </div>
    </div>
  );
};
