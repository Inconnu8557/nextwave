import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { TrendingUp, FileText, Users, UserPlus, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyStats {
  newPosts: number;
  activeUsers: number;
  newMembers: number;
  totalInteractions: number;
}

const fetchDailyActivity = async (): Promise<DailyStats> => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayISO = todayStart.toISOString();

  // Get today's new posts
  const { data: newPostsData, error: postsError } = await supabase
    .from('posts')
    .select('id, author_id, likes')
    .gte('created_at', todayISO);

  if (postsError) {
    console.error('Erreur lors de la récupération des posts du jour:', postsError);
  }

  // Get new users who joined today
  const { data: newUsersData, error: usersError } = await supabase
    .from('profiles')
    .select('id')
    .gte('created_at', todayISO);

  if (usersError) {
    console.error('Erreur lors de la récupération des nouveaux utilisateurs:', usersError);
  }

  // Calculate stats
  const newPosts = newPostsData?.length || 0;
  const newMembers = newUsersData?.length || 0;
  
  // Calculate active users (unique authors who posted today)
  const activeUsers = new Set(newPostsData?.map(post => post.author_id) || []).size;
  
  // Calculate total interactions (total likes on today's posts)
  const totalInteractions = newPostsData?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;

  return {
    newPosts,
    activeUsers,
    newMembers,
    totalInteractions
  };
};

export const DailyActivity = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['daily-activity', new Date().toDateString()], // Cache per day
    queryFn: fetchDailyActivity,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="card-base p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Activité du jour
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-12 mx-auto mb-2" />
              <div className="h-3 bg-slate-700 rounded w-20 mx-auto" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="card-base p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Activité du jour
        </h3>
        <div className="text-center py-4">
          <p className="text-slate-400 text-sm">
            Erreur lors du chargement des statistiques
          </p>
        </div>
      </motion.div>
    );
  }

  const activities = [
    {
      value: stats?.newPosts || 0,
      label: 'Nouveaux posts',
      icon: <FileText className="w-4 h-4" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      value: stats?.activeUsers || 0,
      label: 'Utilisateurs actifs',
      icon: <Users className="w-4 h-4" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      value: stats?.newMembers || 0,
      label: 'Nouveaux membres',
      icon: <UserPlus className="w-4 h-4" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      value: stats?.totalInteractions || 0,
      label: 'Interactions',
      icon: <Heart className="w-4 h-4" />,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="card-base p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        Activité du jour
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="text-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
              <div className={`w-8 h-8 ${activity.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <span className={activity.color}>
                  {activity.icon}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(activity.value)}
              </div>
              <div className="text-xs text-slate-400 leading-tight">
                {activity.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Additional info */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 text-center">
          Statistiques mises à jour toutes les 5 minutes
        </p>
      </div>
    </motion.div>
  );
};
