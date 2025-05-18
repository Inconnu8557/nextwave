import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";
import { MessageCirclePlus } from "lucide-react";

interface Props {
  postId: number;
}
export interface Comment {
  children: never[];
  id: number;
  post_id: number;
  parent_comments_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}
interface NewComment {
  content: string;
  parent_comments_id?: number | null;
}

const CreateComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to post a comment");
  }
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comments_id: newComment.parent_comments_id || null,
    user_id: userId,
    author: author,
  });
  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const { user } = useAuth();
  const QueryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      CreateComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    mutate({ content: newCommentText, parent_comments_id: null });
    setNewCommentText("");
  };
  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];
    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: comment.children || [] });
    });
    flatComments.forEach((comment) => {
      if (comment.parent_comments_id) {
        const parent = map.get(comment.parent_comments_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });
    return roots;
  };

  if (isLoading) {
    return <div> Loading comments...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }
  const commentTree = comments ? buildCommentTree(comments) : [];
  return (
    <div className="mt-6">
      <h3 className="mb-4 text-2xl font-semibold">Comments</h3>
      {/* Create Comment Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full p-2 bg-transparent border rounded border-white/10"
            placeholder="Write a comment..."
            rows={3}
            id="comment"
          />
          
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-3 mt-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            {isPending ? (
              "Posting..."
            ) : (
              <>
                Post Comment <MessageCirclePlus />
              </>
            )}
          </button>
          {isError && (
            <p className="mt-2 text-red-500">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-600">
          You must be logged in to post a comment.
        </p>
      )}
      <div>
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
