import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface ReactionButtonProps {
  postId: number;
  initialReactions?: {
    type: string;
    count: number;
    hasReacted: boolean;
  }[];
}

const REACTIONS = [
  { type: "❤️", label: "Love" },
  { type: "👍", label: "Like" },
  { type: "🎉", label: "Celebrate" },
  { type: "🤔", label: "Think" },
  { type: "😢", label: "Sad" },
];

export const ReactionButton = ({ postId, initialReactions }: ReactionButtonProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addReaction } = useMutation({
    mutationFn: async (reactionType: string) => {
      const { data, error } = await supabase
        .from("reactions")
        .upsert({
          post_id: postId,
          user_id: user?.id,
          type: reactionType,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="text-gray-400 hover:text-gray-300 transition-colors"
      >
        😀
      </button>

      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-lg p-2 shadow-xl">
          <div className="flex space-x-2">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => {
                  addReaction(reaction.type);
                  setShowReactions(false);
                }}
                className="hover:scale-125 transition-transform"
                title={reaction.label}
              >
                {reaction.type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 