import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { Star, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface Contributor {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  post_count: number;
  total_likes: number;
}

const fetchTopContributors = async (): Promise<Contributor[]> => {
  // Get all posts with their likes and author info
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select(`
      id,
      author_id,
      likes,
      profiles:author_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `);

  if (postsError || !posts) {
    console.error('Erreur lors de la récupération des posts:', postsError);
    return [];
  }

  // Group posts by author and calculate stats
  const contributorStats = new Map<string, {
    profile: any;
    post_count: number;
    total_likes: number;
  }>();

  posts.forEach(post => {
    const authorId = post.author_id;
    if (!authorId || !post.profiles) return;

    if (!contributorStats.has(authorId)) {
      contributorStats.set(authorId, {
        profile: post.profiles,
        post_count: 0,
        total_likes: 0
      });
    }

    const stats = contributorStats.get(authorId)!;
    stats.post_count += 1;
    stats.total_likes += post.likes || 0;
  });

  // Convert to array and sort by total engagement (posts + likes)
  const contributors = Array.from(contributorStats.entries())
    .map(([id, stats]) => ({
      id,
      username: stats.profile.username || 'Utilisateur',
      full_name: stats.profile.full_name,
      avatar_url: stats.profile.avatar_url,
      post_count: stats.post_count,
      total_likes: stats.total_likes
    }))
    .sort((a, b) => {
      // Sort by total engagement (weighted: posts worth more than individual likes)
      const scoreA = a.post_count * 10 + a.total_likes;
      const scoreB = b.post_count * 10 + b.total_likes;
      return scoreB - scoreA;
    })
    .slice(0, 3); // Top 3

  return contributors;
};

export const TopContributors = () => {
  const { data: contributors, isLoading, error } = useQuery({
    queryKey: ['top-contributors'],
    queryFn: fetchTopContributors,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const getUserInitials = (username: string, fullName?: string) => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return username.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (index: number) => {
    const gradients = [
      'from-green-500 to-blue-600', // 1st place
      'from-blue-500 to-purple-600', // 2nd place
      'from-purple-500 to-pink-600', // 3rd place
    ];
    return gradients[index] || gradients[0];
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="card-base p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Top contributeurs
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded w-20 mb-1" />
                  <div className="h-3 bg-slate-700 rounded w-24" />
                </div>
                <div className="h-6 w-6 bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error || !contributors || contributors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="card-base p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Top contributeurs
        </h3>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-4">
            {error ? 'Erreur lors du chargement' : 'Aucun contributeur trouvé'}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      className="card-base p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        Top contributeurs
      </h3>
      <div className="space-y-3">
        {contributors.map((contributor, index) => (
          <div 
            key={contributor.id} 
            className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer group"
          >
            {contributor.avatar_url ? (
              <img
                src={contributor.avatar_url}
                alt={contributor.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient(index)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                {getUserInitials(contributor.username, contributor.full_name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                {contributor.full_name || contributor.username}
              </div>
              <div className="text-sm text-slate-400">
                {contributor.post_count} posts • {contributor.total_likes} likes
              </div>
            </div>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-sm font-bold flex-shrink-0">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
