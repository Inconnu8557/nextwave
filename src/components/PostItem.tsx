import { Link } from "react-router";
import { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 blur group-hover:opacity-75 transition-all duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-[rgba(24,27,32,0.8)] backdrop-blur-sm border border-white/10 rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/20">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-3">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[40px] h-[40px] rounded-full object-cover ring-2 ring-purple-500/50"
              />
            ) : (
              <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-tl from-purple-600 to-pink-600" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[22px] leading-[26px] font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {post.title}
              </div>
            </div>
          </div>
          {/* Image Banner */}
          <div className="mt-4 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-[180px] rounded-[16px] object-cover shadow-lg transform transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          <div className="mt-4 flex items-center space-x-4 text-gray-300">
            <span className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full">
              <span className="text-lg">❤️</span>
              <span className="text-sm font-medium">{post.like_count ?? 0}</span>
            </span>
            <span className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full">
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
