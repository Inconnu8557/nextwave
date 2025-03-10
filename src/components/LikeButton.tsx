import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
  postId: number;
}

const vote = async (VoteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("posts_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === VoteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

        if (error) throw new Error(error.message);
    }
  }

  const { error } = await supabase
    .from("votes")
    .insert({ post_id: postId, user_id: userId, vote: VoteValue });
  if (error) throw new Error(error.message);
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: (VoteValue: number) => {
      if (!user) throw new Error("You must be logged in to vote");
      return vote(VoteValue, postId, user.id);
    },
  });

  return (
    <div>
      <button onClick={() => mutate(1)}>👍</button>
      <button onClick={() => mutate(-1)}>👎</button>
    </div>
  );
};
