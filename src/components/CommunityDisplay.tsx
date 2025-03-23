import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWhithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWhithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as PostWhithCommunity[];
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWhithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });
  if (isLoading) {
    return <div>Loading Communities...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <h2>{data && data[0].communities.name}Community Posts</h2>
      {data && data.length > 0 ? (
        <div>
          {data.map((post, key) => (
            <PostItem key={key} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts in this community yet</p>
      )}
    </div>
  );
};
