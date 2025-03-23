import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profile:profile_id (
        avatar_url,
        username
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data: post, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20"></div>
          <div className="text-purple-500">Chargement du post...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>Erreur : {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête du post */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          {post?.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/50"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-tl from-purple-600 to-pink-600" />
          )}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              {post?.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(post!.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              {post?.profile?.username && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.profile.username}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Image du post */}
        {post?.image_url && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-black/20">
            <img
              src={post.image_url}
              alt={post?.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        )}

        {/* Contenu du post */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 leading-relaxed">
            {post?.content}
          </p>
        </div>

        {/* Section des réactions */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center space-x-6">
            <LikeButton postId={postId} />
          </div>
        </div>
      </div>

      {/* Section des commentaires */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <CommentSection postId={postId}/>
      </div>
    </div>
  );
};
