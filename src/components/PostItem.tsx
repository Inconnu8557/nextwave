import { Link } from "react-router";
import { Post } from "./PostList";
import { MessageCircle, Heart, Eye, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Props {
  post: Post;
  index?: number;
}

export const PostItem = ({ post, index = 0 }: Props) => {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Il y a quelques minutes";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    return postDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full group"
    >
      <div className="flex flex-col h-full p-5 card-base card-hover">
        {/* Header */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-start flex-1 min-w-0 gap-3">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="Avatar utilisateur"
                className="flex-shrink-0 object-cover rounded-full w-9 h-9 ring-2 ring-slate-700"
              />
            ) : (
              <div className="flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600">
                {post.author?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium truncate text-slate-200">
                  {post.author?.username || 'Utilisateur'}
                </h3>
                <span className="flex-shrink-0 w-1 h-1 rounded-full bg-slate-500"></span>
                <time className="flex-shrink-0 text-xs text-slate-400">
                  {formatTimeAgo(post.created_at)}
                </time>
              </div>
              
              <Link to={`/post/${post.id}`}>
                <h2 className="text-base font-semibold leading-tight text-white transition-colors line-clamp-2 group-hover:text-blue-300">
                  {post.title}
                </h2>
              </Link>
            </div>
          </div>
          
          <button className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </header>

        {/* Content Preview */}
        <div className="flex flex-col flex-1">
          {post.content && (
            <div className="mb-4">
              <p className="text-sm leading-relaxed text-slate-300">
                {isExpanded ? post.content : truncateContent(post.content)}
                {post.content.length > 120 && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsExpanded(!isExpanded);
                    }}
                    className="ml-2 text-xs font-medium text-blue-400 hover:text-blue-300"
                  >
                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Image - Taille fixe pour uniformité */}
          {post.image_url && !imageError && (
            <Link to={`/post/${post.id}`} className="block mb-4">
              <div className="relative overflow-hidden rounded-lg bg-slate-700/30">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100" />
              </div>
            </Link>
          )}

          {/* Community Tag */}
          {post.community && (
            <div className="mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {post.community.name}
              </span>
            </div>
          )}

          {/* Spacer pour pousser le footer en bas */}
          <div className="flex-1"></div>

          {/* Footer - Actions */}
          <footer className="pt-3 mt-auto border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 text-slate-400 text-sm">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">{post.like_count || 0}</span>
                </button>
                
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200 text-slate-400 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">{post.comment_count || 0}</span>
                </button>
                
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 text-sm">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{post.view_count || 0}</span>
                </div>
              </div>
              
              <div className="font-mono text-xs text-slate-500">
                #{post.id.toString().slice(-4)}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </motion.article>
  );
};
