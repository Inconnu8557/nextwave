import { JSX, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  User,
  LogOut,
  Settings,
  Home,
  PenSquare,
  Users,
  Menu,
  X,
  MessageCircleMore,
} from "lucide-react";

export const Sidebar = ({ isVisible, toggleSidebar }: { isVisible: boolean; toggleSidebar: () => void }) => {
  const { user } = useAuth() as {
    user: SupabaseUser | null;
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-56 bg-black/20 backdrop-blur-lg border-r border-white/10 transition-transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Bouton de bascule */}
      <button
        onClick={toggleSidebar}
        className="absolute p-2 text-white rounded-full top-4 right-4 bg-black/50 hover:bg-black/70"
      >
        {isVisible ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo */}
      <div className="p-4">
        <Link
          to="/"
          className="ml-8 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text z-999"
        >
          NextWave
        </Link>
      </div>
      <div className="flex flex-col h-full p-4 space-y-4">
        {/* Navigation principale */}
        <NavItem to="/" icon={<Home size={18} />} text="Accueil" />
        <NavItem to="/communities" icon={<Users size={18} />} text="Communautés" />
        <NavItem to="/chat" icon={<MessageCircleMore size={18} />} text="Chat" />

        {user && (
          <>
            {/* Boutons de création */}
            <Link
              to="/create"
              className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <PenSquare size={18} className="mr-2" />
              <span>Créer un post</span>
            </Link>
            <Link
              to="/community/create"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 transition-all border rounded-lg border-white/10 hover:bg-white/5"
            >
              <Users size={18} className="mr-2" />
              <span>Créer une communauté</span>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};

const NavItem = ({
  to,
  icon,
  text,
}: {
  to: string;
  icon: JSX.Element;
  text: string;
}) => (
  <Link
    to={to}
    className="flex items-center space-x-1.5 text-gray-300 transition-all duration-300 hover:text-white group px-2 py-1 rounded-md hover:bg-white/5"
  >
    <span className="transition-transform duration-300 group-hover:scale-110">
      {icon}
    </span>
    <span className="transition-colors duration-300">{text}</span>
  </Link>
);

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
