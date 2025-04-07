import { JSX, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Home,
  PenSquare,
  Users,
  Compass,
  Menu,
  X
} from "lucide-react";
import { SearchBar } from "./SearchBar";

export const Navbar = () => {
  const { user, signOut } = useAuth() as { user: SupabaseUser | null, signOut: () => void };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-black/20 backdrop-blur-lg border-white/10 max-w-screen-xl mx-auto">
      <div className="w-full flex items-center justify-between px-4 py-4">
        {/* Section gauche: Logo et navigation principale */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            NextWave
          </Link>
          
          {/* Navigation principale (cachée sur mobile) */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem to="/" icon={<Home size={18} />} text="Accueil" />
            <NavItem to="/explore" icon={<Compass size={18} />} text="Explorer" />
            <NavItem to="/communities" icon={<Users size={18} />} text="Communautés" />
          </div>
        </div>

        {/* Section centrale: Barre de recherche */}
        <div className="flex-1 w-full px-8 mx-4">
          <div className="max-w-2xl mx-auto transition-all duration-300 focus-within:max-w-full">
            <SearchBar />
          </div>
        </div>

        {/* Section droite: Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Boutons de création (cachés sur mobile) */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/create"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <PenSquare size={18} className="mr-2" />
                  <span className="hidden sm:inline">Créer un post</span>
                  <span className="sm:hidden">Post</span>
                </Link>
                <Link
                  to="/community/create"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 transition-all border rounded-lg border-white/10 hover:bg-white/5"
                >
                  <Users size={18} className="mr-2" />
                  <span className="hidden sm:inline">Créer une communauté</span>
                  <span className="sm:hidden">Communauté</span>
                </Link>
              </div>

              {/* Menu utilisateur */}
              <div className="pl-4 border-l border-white/10">
                <UserMenu 
                  displayName={user.user_metadata?.username || user.email || 'User'} 
                  avatar={user.user_metadata?.avatar_url} 
                  signOut={signOut} 
                />
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-medium text-gray-300 transition-all border rounded-lg border-white/10 hover:bg-white/5"
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>

        {/* Bouton menu mobile */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu déroulant pour mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/20 backdrop-blur-lg border-t border-white/10">
          <div className="flex flex-col items-center space-y-2 py-4">
            <NavItem to="/" icon={<Home size={18} />} text="Accueil" />
            <NavItem to="/explore" icon={<Compass size={18} />} text="Explorer" />
            <NavItem to="/communities" icon={<Users size={18} />} text="Communautés" />
            {user && (
              <>
                <Link
                  to="/create"
                  className="flex items-center px-2 py-2 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <PenSquare size={18} className="mr-2" />
                  <span>Créer un post</span>
                </Link>
                <Link
                  to="/community/create"
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 transition-all border rounded-lg border-white/10 hover:bg-white/5"
                >
                  <Users size={18} className="mr-2" />
                  <span>Créer une communauté</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

/* Composant NavItem (Factorisation des liens) */
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

/* Composant UserMenu avec menu déroulant au clic */
const UserMenu = ({
  displayName,
  avatar,
  signOut,
  mobile = false,
}: {
  displayName: string;
  avatar?: string;
  signOut: () => void;
  mobile?: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`relative ${
        mobile ? "flex flex-col items-center" : "flex items-center space-x-3"
      }`}
    >
      {avatar && (
        <img
          src={avatar}
          alt="Avatar"
          className="w-8 h-8 transition-all duration-300 border-2 rounded-full border-purple-500/50 hover:border-purple-400"
        />
      )}

      {/* Bouton pour ouvrir le menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center text-gray-300 transition hover:text-white"
      >
        <span>{displayName}</span>
        <ChevronDown
          size={18}
          className={`ml-1 transition-transform ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu déroulant positionné en dessous */}
      {menuOpen && (
        <div
          className={`absolute top-full mt-2 left-0 bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-opacity ${
            mobile ? "relative w-full mt-0" : "w-48"
          }`}
        >
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