import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "./Sidebar"; // Importation du UserMenu

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 max-w-screen-xl mx-auto border-b bg-black/20 backdrop-blur-lg border-white/10">
      <div className="flex items-center justify-between w-full px-4 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
          NextWave
        </Link>

        {/* SearchBar */}
        <div className="flex-1 w-full px-8 mx-4">
          <div className="max-w-2xl mx-auto transition-all duration-300 focus-within:max-w-full">
            <SearchBar />
          </div>
        </div>

        {/* Menu utilisateur */}
        {user && (
          <UserMenu
            displayName={user.user_metadata?.username || user.email || "User"}
            avatar={user.user_metadata?.avatar_url}
            signOut={signOut}
          />
        )}

        {/* Boutons de connexion et d'inscription */}
        {!user && (
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
    </nav>
  );
};