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
    <div className="border-l-2 border-purple-500/20 pl-4 my-4">
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <span className="font-medium text-purple-400">{comment.author}</span>
          <span className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-300 mb-3">{comment.content}</p>
        <button 
          onClick={() => setShowReply((prev) => !prev)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showReply ? "Annuler" : "Répondre"}
        </button>
      </div>
      
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mt-4 mb-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            placeholder="Écrire une réponse..."
            rows={2}
          />
          <button
            type="submit"
            className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isPending ? "Publication..." : "Publier la réponse"}
          </button>
          {isError && <p className="text-red-500 mt-2">Erreur lors de la publication de la réponse.</p>}
        </form>
      )}
      
      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
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
            <span>{comment.children.length} réponses</span>
          </button>
          
          {!isCollapsed && (
            <div className="space-y-2 mt-2">
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
