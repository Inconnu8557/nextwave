import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGithub, signOut, user } = useAuth();

  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="fixed top-0 z-40 w-full transition-all duration-300 border-b border-gray-700 shadow-lg bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-lg">
      <div className="max-w-5xl px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-mono text-2xl font-bold text-white transition-transform transform hover:scale-105">
            Next<span className="text-purple-500">.Wave</span>
          </Link>

          {/* Desktop Links */}
          <div className="items-center hidden space-x-8 font-extrabold md:flex">
            <Link to="/" className="flex items-center text-gray-300 transition-colors hover:text-white hover:underline">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              Home
            </Link>
            <Link to="/create" className="flex items-center text-gray-300 transition-colors hover:text-white hover:underline">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </Link>
            <Link to="/communities" className="flex items-center text-gray-300 transition-colors hover:text-white hover:underline">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Communities
            </Link>
            <Link to="/community/create" className="flex items-center text-gray-300 transition-colors hover:text-white hover:underline">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Community
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="items-center hidden md:flex">
            {user ? (
              <div className="relative flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="object-cover w-8 h-8 border rounded-full shadow-md border-white/20"
                  />
                )}
                <span 
                  className="text-gray-300 cursor-pointer" 
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  {displayName}
                </span>
                <button
                  onClick={signOut}
                  className="px-3 py-1 transition-colors bg-red-500 rounded shadow-md hover:bg-red-600"
                >
                  Sign Out
                </button>
La partie que tu dois modifier : 
                {menuOpen && (
                  <div className="absolute right-0 z-50 w-48 mt-1 bg-gray-800 rounded-md shadow-lg">
                    <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Settings</Link>
                    <button 
                      onClick={signOut} 
                      className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGithub}
                className="px-3 py-1 transition-colors bg-blue-500 rounded shadow-md hover:bg-blue-600"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
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
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700"
            >
              Create Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};