import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface ReactionButtonProps {
  postId: number;
}

interface Reaction {
  id: number;
  post_id: number;
  user_id: string;
  type: string;
}

const REACTIONS = [
  { type: "❤️", label: "Aimer" },
  { type: "👍", label: "Pouce en l'air" },
  { type: "🎉", label: "Célébrer" },
  { type: "🤔", label: "Réfléchir" },
  { type: "😢", label: "Triste" },
];

const fetchReactions = async (postId: number): Promise<Reaction[]> => {
  const { data, error } = await supabase
    .from("reactions")
    .select("*")
    .eq("post_id", postId);
  
  if (error) throw error;
  return data || [];
};

export const ReactionButton = ({ postId }: ReactionButtonProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reactions = [] } = useQuery<Reaction[]>({
    queryKey: ["reactions", postId],
    queryFn: () => fetchReactions(postId),
  });

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
      queryClient.invalidateQueries({ queryKey: ["reactions", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const getReactionCount = (type: string) => {
    return reactions.filter(r => r.type === type).length;
  };

  const hasUserReacted = (type: string) => {
    return reactions.some(r => r.type === type && r.user_id === user?.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="text-gray-400 hover:text-gray-300 transition-colors"
      >
        😀
      </button>

      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-lg p-2 shadow-xl min-w-[200px]">
          <div className="space-y-2">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => {
                  addReaction(reaction.type);
                  setShowReactions(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 transition-colors ${
                  hasUserReacted(reaction.type) ? 'bg-purple-500/20' : ''
                }`}
                title={reaction.label}
              >
                <span className="flex items-center">
                  <span className="text-xl mr-2">{reaction.type}</span>
                  <span className="text-sm text-gray-400">{reaction.label}</span>
                </span>
                <span className="text-sm text-gray-500">{getReactionCount(reaction.type)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex -space-x-1 mt-2">
        {REACTIONS.map(reaction => {
          const count = getReactionCount(reaction.type);
          if (count > 0) {
            return (
              <div
                key={reaction.type}
                className="bg-white/5 px-2 py-1 rounded-full text-sm flex items-center"
                title={`${count} ${reaction.label}`}
              >
                <span className="mr-1">{reaction.type}</span>
                <span className="text-gray-400">{count}</span>
              </div>
            );
          }
          return null;
        }).filter(Boolean)}
      </div>
    </div>
  );
}; 