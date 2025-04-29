import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

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
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");
  if (error) throw new Error(error.message);
  return data as Post[];
};

export const PostList = () => {
  const { data: posts, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500 animate-pulse">Chargement des posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md px-4 py-2 mx-auto text-red-700 bg-red-100 rounded-lg">
        <strong className="font-semibold">Erreur :</strong> {error.message}
      </div>
    );
  }

  return (
    <section className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden transition duration-300 transform shadow-lg rounded-2xl hover:shadow-2xl hover:scale-105"
          >
            <PostItem post={post} />
          </article>
        ))}
      </div>
    </section>
  );
};
