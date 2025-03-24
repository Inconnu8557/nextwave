import { useState } from "react";
import { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  comment: Comment & {
    children: Comment[];
  };
  postId: number;
}
const CreateReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to post a reply");
  }
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comments_id: parentCommentId,
    user_id: userId,
    author: author,
  });
  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const { user } = useAuth();
  const QueryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      CreateReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };
  return (
    <div className="pl-4 my-4 border-l-2 rounded-lg shadow-lg border-purple-500/20">
      <div className="p-4 transition-transform rounded-lg bg-white/10 hover:scale-105">
        <div className="flex items-center mb-2 space-x-3">
          <span className="font-medium text-purple-400">{comment.author}</span>
          <span className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <p className="mb-3 text-gray-300">{comment.content}</p>
        <button 
          onClick={() => setShowReply((prev) => !prev)}
          className="text-sm font-semibold text-purple-400 transition-colors hover:text-purple-300"
        >
          {showReply ? "Annuler" : "Répondre"}
        </button>
      </div>
      
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mt-4 mb-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-3 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            placeholder="Écrire une réponse..."
            rows={2}
          />
          <button
            type="submit"
            className="px-4 py-2 mt-2 font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            {isPending ? "Publication..." : "Publier la réponse"}
          </button>
          {isError && <p className="mt-2 text-red-500">Erreur lors de la publication de la réponse.</p>}
        </form>
      )}
      
      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex items-center space-x-2 text-sm text-gray-400 transition-colors hover:text-gray-300"
            title={isCollapsed ? "Masquer les réponses" : "Afficher les réponses"}
          >
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
            <span className="font-semibold">{comment.children.length} réponses</span>
          </button>
          
          {!isCollapsed && (
            <div className="mt-2 space-y-2">
              {comment.children.map((child, key) => (
                <CommentItem key={key} comment={child} postId={postId}/>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
