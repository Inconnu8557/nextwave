import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "./Sidebar";
import { Menu } from "lucide-react";
import { motion } from "motion/react";

export const Navbar = ({ toggleSidebar, isSidebarVisible }: { toggleSidebar: () => void; isSidebarVisible: boolean }) => {
  const { user, signOut } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 border-b bg-slate-900/80 backdrop-blur-xl border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            {!isSidebarVisible && (
              <button
                onClick={toggleSidebar}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-ring"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <Link to="/" className="flex items-center">
              <div className="text-xl font-bold text-gradient">
                NextWave
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
            <SearchBar />
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu
                displayName={user.user_metadata?.username || user.email || "User"}
                avatar={user.user_metadata?.avatar_url}
                signOut={signOut}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signin" className="btn-ghost text-sm">
                  Connexion
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="pb-4 sm:hidden">
          <SearchBar />
        </div>
      </div>
    </motion.nav>
  );
};
