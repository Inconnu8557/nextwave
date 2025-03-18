import React, { Children, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";

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
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {/* Create Comment Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            placeholder="Write a comment..."
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment.</p>
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
