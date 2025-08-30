import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { motion } from "motion/react";
import { AlertCircle, Loader2 } from "lucide-react";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url: string | null;
  like_count?: number;
  comment_count?: number;
  reaction_count?: number;
  view_count?: number;
  author?: {
    username?: string;
    avatar_url?: string;
  };
  community?: {
    name: string;
    id: number;
  };
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");
  if (error) throw new Error(error.message);
  return data as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-base p-5 animate-pulse h-full">
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-9 h-9 bg-slate-700 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-3 bg-slate-700 rounded mb-2 w-20" />
                  <div className="h-4 bg-slate-700 rounded w-full" />
                </div>
              </div>
              <div className="w-4 h-4 bg-slate-700 rounded" />
            </div>
            
            {/* Content skeleton */}
            <div className="mb-4">
              <div className="h-3 bg-slate-700 rounded mb-2" />
              <div className="h-3 bg-slate-700 rounded w-3/4" />
            </div>
            
            {/* Image skeleton */}
            <div className="h-48 bg-slate-700 rounded-lg mb-4" />
            
            {/* Footer skeleton */}
            <div className="pt-3 border-t border-slate-700/50 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="h-6 w-12 bg-slate-700 rounded" />
                  <div className="h-6 w-12 bg-slate-700 rounded" />
                  <div className="h-6 w-12 bg-slate-700 rounded" />
                </div>
                <div className="h-3 w-8 bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-base p-8 text-center"
      >
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Erreur de chargement</h3>
        <p className="text-slate-400 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Réessayer
        </button>
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-base p-8 text-center"
      >
        <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Aucun post disponible</h3>
        <p className="text-slate-400">Soyez le premier à partager quelque chose !</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 auto-rows-fr">
      {data.map((post, index) => (
        <PostItem key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};
