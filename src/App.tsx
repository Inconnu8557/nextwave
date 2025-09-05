import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPages } from "./pages/CreatePostPages";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPages } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignUpForm } from "./components/SignUpForm";
import { SignInForm } from "./components/SignInForm";
import Chat from "./pages/Chat";
import { Sidebar } from "./components/Sidebar";
import { useState } from "react";
import { House } from "lucide-react";
import { Link } from "react-router-dom";
import { Users, MessageCircleMore, User as UserIcon } from "lucide-react";
import NeonCursor from "./components/NeonCursor";
import VerifyEmail from "./pages/VerifyEmail";
import { useIsMobile } from "./hooks/useIsMobile";
import { useAuth } from "./context/AuthContext";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { NotificationBanner } from "./components/NotificationBanner";
import TestComponent from "./pages/Test.tsx"

function App() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };
  // Callback appelé lorsque l'animation est terminée

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NeonCursor />
      
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <Navbar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />
      
      {/* Notification Banner */}
      <NotificationBanner />

      {/* Sidebar */}
      {(!isMobile && isSidebarVisible) || (isMobile && !user && isSidebarVisible) ? (
        <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} onlyAuthButtons={isMobile && !user} />
      ) : null}
      
      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
          <Routes>
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePostPages />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/community/create" element={<CreateCommunityPages />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:id" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/test" element={<TestComponent />} />
          </Routes>
        </div>
      </main>

      {/* Floating Action Button - Only for authenticated users */}
      {user && <FloatingActionButton />}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-3">
          <div className="flex justify-around items-center">
            <Link to="/" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
              <House size={20} />
              <span className="text-xs">Accueil</span>
            </Link>
            <Link to="/communities" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
              <Users size={20} />
              <span className="text-xs">Communautés</span>
            </Link>
            <Link to="/chat" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
              <MessageCircleMore size={20} />
              <span className="text-xs">Chat</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-white transition-colors">
              <UserIcon size={20} />
              <span className="text-xs">Profil</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
