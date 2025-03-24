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

  const userReaction = reactions.find(r => r.user_id === user?.id);

  const { mutate: addOrUpdateReaction } = useMutation({
    mutationFn: async (reactionType: string) => {
      try {
        if (userReaction) {
          if (userReaction.type === reactionType) {
            // Si l'utilisateur clique sur la même réaction, supprimez-la
            const { error } = await supabase
              .from("reactions")
              .delete()
              .eq("id", userReaction.id);

            if (error) throw error;
            return;
          } else {
            // Sinon, mettez à jour la réaction existante
            const { data, error } = await supabase
              .from("reactions")
              .update({ type: reactionType })
              .eq("id", userReaction.id);

            if (error) throw error;
            return data;
          }
        } else {
          // Ajoutez une nouvelle réaction
          const { data, error } = await supabase
            .from("reactions")
            .insert({
              post_id: postId,
              user_id: user?.id,
              type: reactionType,
            });

          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout ou de la mise à jour de la réaction:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", postId] });
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
        className="text-2xl text-gray-400 transition-colors hover:text-gray-300"
      >
        😀
      </button>

      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl min-w-[250px] transition-opacity duration-300 ease-in-out">
          <div className="grid grid-cols-2 gap-2">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => {
                  addOrUpdateReaction(reaction.type);
                  setShowReactions(false);
                }}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 ${
                  userReaction?.type === reaction.type ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title={reaction.label}
              >
                <span className="text-3xl">{reaction.type}</span>
                <span className="ml-2 text-sm">{getReactionCount(reaction.type)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex mt-2 -space-x-1">
        {REACTIONS.map(reaction => {
          const count = getReactionCount(reaction.type);
          if (count > 0) {
            return (
              <div
                key={reaction.type}
                className="flex items-center px-2 py-1 text-sm rounded-full bg-white/5"
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