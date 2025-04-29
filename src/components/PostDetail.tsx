import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import { LikeButton } from "./LikeButton";
import { ReactionButton } from "./ReactionButton";
import { CommentSection } from "./CommentSection";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Post } from "./PostList";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles (avatar_url)")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return { ...data, avatar_url: data.profiles.avatar_url } as Post;
};

export const PostDetail = ({ postId }: Props) => {
  useAuth();
  const { data: post, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="flex flex-col items-center space-y-3"
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, loop: Infinity }}
        >
          <div className="rounded-full w-14 h-14 bg-violet-600/20" />
          <motion.span
            className="text-lg font-medium text-violet-600"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, loop: Infinity }}
          >
            Chargement du post...
          </motion.span>
        </motion.div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4 text-center">
          <ArrowLeft className="w-12 h-12 mx-auto text-red-500" />
          <p className="font-semibold text-red-500">Erreur : {error?.message}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl p-6 mx-auto space-y-8 shadow-xl lg:p-10 bg-gradient-to-br from-violet-700 to-violet-500 backdrop-blur-md rounded-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={() => window.history.back()}
        className="flex items-center space-x-2 text-sm text-gray-100 hover:text-white"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </motion.button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <motion.div whileHover={{ rotate: 360 }} className="shrink-0">
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="Avatar"
              className="w-16 h-16 rounded-full ring-4 ring-violet-400"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 to-violet-300" />
          )}
        </motion.div>
        <div className="mt-4 sm:mt-0">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-violet-600">
            {post.title}
          </h1>
          <p className="mt-1 text-sm text-gray-200">
            Publié le {new Date(post.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Image */}
      {post.image_url && (
        <motion.div
          className="relative w-full overflow-hidden shadow-inner rounded-2xl"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={post.image_url}
            alt={post.title}
            className="object-cover w-full h-64 sm:h-96"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.section
        className="prose prose-lg prose-white max-w-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </motion.section>

      {/* Actions */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-violet-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <LikeButton postId={postId} />
          <ReactionButton postId={postId} />
        </div>
        <span className="text-sm text-gray-200">
          {post.comment_count ?? 0} commentaire{post.comment_count! > 1 ? 's' : ''}
        </span>
      </motion.div>

      {/* Comments */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <CommentSection postId={postId} />
      </motion.section>
    </motion.div>
  );
};
