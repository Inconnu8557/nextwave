import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div>
      <h2>Recent Posts</h2> 
      <div>
        <PostList />
      </div>
    </div>
  );
};
