import { useAuth } from "../context/AuthContext";

interface Props {
  postId: number;
}

export const CommentSection = ({ postId }: Props) => {
  const { user } = useAuth();
  const handleSubmit = () => {};
  return (
    <div>
      <h3>Comments</h3>
      {user ? (
        <form onSubmit={handleSubmit}>
          <textarea rows={3} placeholder="Write a comment..." />
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p>You must be logged in to post a comment</p>
      )}
    </div>
  );
};
