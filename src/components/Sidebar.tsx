import { JSX, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  User,
  LogOut,
  Settings,
  Home,
  PenSquare,
  Users,
  X,
  MessageCircle,
  TrendingUp,
  Bookmark,
  Bell,
  Hash,
  Plus,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Sidebar = ({ isVisible, toggleSidebar, onlyAuthButtons = false }: { isVisible: boolean; toggleSidebar: () => void; onlyAuthButtons?: boolean }) => {
  const { user } = useAuth() as {
    user: SupabaseUser | null;
  };
  const location = useLocation();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay pour mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={toggleSidebar}
          />
          
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 z-50 h-full w-80 md:w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <Link to="/" onClick={toggleSidebar}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <span className="text-xl font-bold text-gradient">NextWave</span>
                </div>
              </Link>
              
              <button
                onClick={toggleSidebar}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!onlyAuthButtons ? (
                <nav className="p-4 space-y-2">
                  {/* Navigation principale */}
                  <div className="mb-6">
                    <NavItem to="/" icon={<Home size={20} />} text="Accueil" isActive={location.pathname === '/'} onClick={toggleSidebar} />
                    <NavItem to="/trending" icon={<TrendingUp size={20} />} text="Tendances" isActive={location.pathname === '/trending'} onClick={toggleSidebar} />
                    <NavItem to="/explore" icon={<Compass size={20} />} text="Explorer" isActive={location.pathname === '/explore'} onClick={toggleSidebar} />
                    <NavItem to="/communities" icon={<Users size={20} />} text="Communautés" isActive={location.pathname === '/communities'} onClick={toggleSidebar} />
                    <NavItem to="/chat" icon={<MessageCircle size={20} />} text="Messages" isActive={location.pathname === '/chat'} onClick={toggleSidebar} badge={3} />
                    {user && (
                      <>
                        <NavItem to="/bookmarks" icon={<Bookmark size={20} />} text="Favoris" isActive={location.pathname === '/bookmarks'} onClick={toggleSidebar} />
                        <NavItem to="/notifications" icon={<Bell size={20} />} text="Notifications" isActive={location.pathname === '/notifications'} onClick={toggleSidebar} badge={7} />
                        <NavItem to="/profile" icon={<User size={20} />} text="Profil" isActive={location.pathname === '/profile'} onClick={toggleSidebar} />
                      </>
                    )}
                  </div>

                  {/* Actions de création */}
                  {user && (
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Créer</h3>
                      <Link
                        to="/create"
                        onClick={toggleSidebar}
                        className="flex items-center gap-3 px-3 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25"
                      >
                        <PenSquare size={18} />
                        <span>Nouveau post</span>
                      </Link>
                      
                      <Link
                        to="/community/create"
                        onClick={toggleSidebar}
                        className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                      >
                        <Plus size={18} />
                        <span>Créer une communauté</span>
                      </Link>
                    </div>
                  )}

                  {/* Trending Topics */}
                  <div className="pt-6 border-t border-slate-800 mt-6">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Tendances</h3>
                    <div className="space-y-2">
                      <TrendingItem tag="#ReactJS" posts={1234} />
                      <TrendingItem tag="#OpenSource" posts={856} />
                      <TrendingItem tag="#WebDev" posts={742} />
                      <TrendingItem tag="#NextJS" posts={623} />
                      <TrendingItem tag="#TailwindCSS" posts={445} />
                    </div>
                  </div>
                </nav>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Rejoignez NextWave</h2>
                    <p className="text-slate-400 text-sm">Connectez-vous pour découvrir une communauté de développeurs passionnés</p>
                  </div>
                  
                  <Link
                    to="/signin"
                    onClick={toggleSidebar}
                    className="btn-ghost w-full text-center"
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/signup"
                    onClick={toggleSidebar}
                    className="btn-primary w-full text-center"
                  >
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>

            {/* Footer avec user si connecté */}
            {user && !onlyAuthButtons && (
              <div className="p-4 border-t border-slate-800">
                <UserMenuCompact
                  displayName={user.user_metadata?.username || user.email || "User"}
                  avatar={user.user_metadata?.avatar_url}
                  signOut={() => {
                    toggleSidebar();
                    // Ajouter la logique de signOut ici
                  }}
                />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const NavItem = ({
  to,
  icon,
  text,
  isActive = false,
  onClick,
  badge,
}: {
  to: string;
  icon: JSX.Element;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: number;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
        : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`transition-all duration-200 ${
        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
      }`}>
        {icon}
      </span>
      <span className="font-medium">{text}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </Link>
);

const TrendingItem = ({ tag, posts }: { tag: string; posts: number }) => (
  <button className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 rounded-lg transition-colors">
    <div>
      <div className="text-slate-300 font-medium text-sm">{tag}</div>
      <div className="text-slate-500 text-xs">{posts.toLocaleString()} posts</div>
    </div>
    <Hash className="w-4 h-4 text-slate-500" />
  </button>
);

const UserMenuCompact = ({
  displayName,
  avatar,
  signOut,
}: {
  displayName: string;
  avatar?: string;
  signOut: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {displayName[0]?.toUpperCase() || 'U'}
          </div>
        )}
        
        <div className="flex-1 text-left">
          <div className="font-medium text-white truncate">{displayName}</div>
          <div className="text-sm text-slate-400">@{displayName.toLowerCase().replace(' ', '')}</div>
        </div>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 w-full mb-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden"
          >
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <User size={16} />
              <span>Mon profil</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Settings size={16} />
              <span>Paramètres</span>
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors w-full text-left"
            >
              <LogOut size={16} />
              <span>Se déconnecter</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserMenu = ({
  displayName,
  avatar,
  signOut,
}: {
  displayName: string;
  avatar?: string;
  signOut: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex items-center space-x-3 z-999">
      {avatar && (
        <img
          src={avatar}
          alt="Avatar"
          className="w-8 h-8 transition-all duration-300 border-2 rounded-full border-purple-500/50 hover:border-purple-400"
        />
      )}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center text-gray-300 transition hover:text-white"
      >
        <span>{displayName}</span>
      </button>

      {menuOpen && (
        <div className="absolute left-0 w-48 mt-2 overflow-hidden bg-gray-800 rounded-lg shadow-lg top-full">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700"
          >
            <User size={16} className="mr-2" /> Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700"
          >
            <Settings size={16} className="mr-2" /> Settings
          </Link>
          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-700"
          >
            <LogOut size={16} className="mr-2" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export { UserMenu };
