interface Props {
  postId: number;
}

export const LikeButton = ({}: Props) => {
  return (
    <div>
      <button>Like</button>
      <button>Dislike</button>
    </div>
  );
};
