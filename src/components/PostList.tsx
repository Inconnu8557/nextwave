import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) <div>Loading posts...</div>;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data);

  return (
    <div>
      {data?.map((post) => (
        <PostItem />
      ))}
    </div>
  );
};
