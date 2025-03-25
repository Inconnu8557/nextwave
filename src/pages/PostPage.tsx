import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Post } from "../components/PostList";

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: post, error } = useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Post ID is undefined");
      }
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du post:", error.message);
        throw error;
      }
      return data as Post;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!post && error) {
      navigate('/');
    }
  }, [post, error, navigate]);

  return (
    <div className="pt-10">
      <div>
        <PostDetail postId={Number(id)} />
      </div>
    </div>
  );
};
