import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "./Sidebar"; // Importation du UserMenu
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 max-w-screen-xl mx-auto border-b bg-black/20 backdrop-blur-lg border-white/10">
      <div className="flex items-center justify-between w-full px-2 py-3 sm:px-4 sm:py-4">
        {/* Logo ou titre (optionnel) */}
        {/* <div className="flex items-center flex-shrink-0">
          <Link to="/" className="hidden text-lg font-bold text-white sm:block">
            NextWave
          </Link>
        </div> */}

        {/* SearchBar */}
        <div className="flex-1 w-full px-2 mx-2 sm:px-8 sm:mx-4">
          <div className="max-w-full mx-auto transition-all duration-300 sm:max-w-2xl focus-within:max-w-full">
            <SearchBar />
          </div>
        </div>

        {/* Menu burger mobile */}
        <div className="flex items-center sm:hidden">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center p-2 text-gray-300 rounded-md hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Ouvrir le menu utilisateur"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu utilisateur desktop */}
        <div className="items-center hidden space-x-2 sm:flex">
          {user && (
            <UserMenu
              displayName={user.user_metadata?.username || user.email || "User"}
              avatar={user.user_metadata?.avatar_url}
              signOut={signOut}
            />
          )}
          {!user && (
            <>
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
            </>
          )}
        </div>
      </div>
      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="px-4 pb-4 sm:hidden animate-fade-in">
          <div className="flex flex-col items-stretch mt-2 space-y-2">
            {user && (
              <UserMenu
                displayName={user.user_metadata?.username || user.email || "User"}
                avatar={user.user_metadata?.avatar_url}
                signOut={signOut}
              />
            )}
            {!user && (
              <>
                <Link
                  to="/signin"
                  className="w-full px-4 py-2 text-sm font-medium text-center text-gray-300 transition-all border rounded-lg border-white/10 hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="w-full px-4 py-2 text-sm font-medium text-center text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};