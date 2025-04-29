import { Link } from "react-router";
import { Post } from "./PostList";
import { MessageCircleMore, ThumbsUp } from "lucide-react";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="relative z-10 block">
        <div className="w-[360px] bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-[20px] text-white flex flex-col p-6 overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-xl">
          <div className="flex items-center space-x-4">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[48px] h-[48px] rounded-full object-cover ring-2 ring-purple-500/50"
              />
            ) : (
              <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-tl from-purple-600 to-pink-600" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[24px] leading-[28px] font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent line-clamp-2">
                {post.title}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-[220px] rounded-[16px] object-cover shadow-lg transform transition-transform duration-300 group-hover:scale-[1.05]"
            />
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center space-x-3">
              <span className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <span className="text-xl"><ThumbsUp /></span>
                <span className="text-sm font-medium">{post.like_count ?? 0}</span>
              </span>
              <span className="flex items-center px-4 py-2 space-x-2 text-gray-300 transition-colors rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:bg-gray-600">
                <span className="text-xl"><MessageCircleMore /></span>
                <span className="text-sm font-medium">{post.comment_count ?? 0}</span>
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
