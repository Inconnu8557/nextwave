import { JSX, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Home,
  Users,
  PlusSquare,
  ChevronDown,
} from "lucide-react";
import { SearchBar } from "./SearchBar";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGithub, signOut, user } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="fixed top-0 z-50 w-full transition-all duration-300 border-b shadow-lg backdrop-blur-xl bg-gray-900/60 border-white/5">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-extrabold text-white transition-all duration-300 hover:scale-105 hover:text-purple-400"
          >
            Next<span className="text-transparent bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text">.Wave</span>
          </Link>

          {/* Search Bar - Visible sur Desktop */}
          <div className="hidden mx-4 md:block md:w-1/4">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-6 text-sm font-medium text-white md:flex">
            <NavItem to="/" icon={<Home size={16} />} text="Home" />
            <NavItem
              to="/create"
              icon={<PlusSquare size={16} />}
              text="Create Post"
            />
            <NavItem
              to="/communities"
              icon={<Users size={16} />}
              text="Communities"
            />
            <NavItem
              to="/community/create"
              icon={<PlusSquare size={16} />}
              text="Create Community"
            />
          </div>

          {/* User Section */}
          <div className="items-center hidden pl-4 md:flex">
            {user ? (
              <UserMenu
                displayName={displayName}
                avatar={user.user_metadata?.avatar_url}
                signOut={signOut}
              />
            ) : (
              <button
                onClick={signInWithGithub}
                className="px-3 py-1.5 text-sm text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/20"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-white transition-all duration-300 rounded-lg hover:bg-white/10 md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 w-full py-3 transition-all duration-300 border-b md:hidden top-14 bg-gray-900/90 backdrop-blur-xl border-white/5">
          {/* Search Bar - Mobile */}
          <div className="px-4 mb-4">
            <SearchBar />
          </div>

          <div className="flex flex-col items-center space-y-4 text-white">
            <NavItem to="/" icon={<Home size={20} />} text="Home" />
            <NavItem
              to="/create"
              icon={<PlusSquare size={20} />}
              text="Create Post"
            />
            <NavItem
              to="/communities"
              icon={<Users size={20} />}
              text="Communities"
            />
            <NavItem
              to="/community/create"
              icon={<PlusSquare size={20} />}
              text="Create Community"
            />

            {user ? (
              <UserMenu
                displayName={displayName}
                avatar={user.user_metadata?.avatar_url}
                signOut={signOut}
                mobile
              />
            ) : (
              <button
                onClick={signInWithGithub}
                className="px-4 py-2 transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Sign in with GitHub
              </button>
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
    <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
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
