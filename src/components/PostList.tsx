import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
// import { data } from "react-router";
import { motion } from "framer-motion";

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

// console.log(data);

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // console.log(data);

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {data?.map((post, key) => (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
          key={key}
        >
          <PostItem post={post} />
        </motion.div>
      ))}
    </div>
  );
};
