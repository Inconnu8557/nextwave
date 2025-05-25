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
import { House, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Users, MessageCircleMore, User as UserIcon } from "lucide-react";
import NeonCursor from "./components/NeonCursor";

function App() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };
  // Callback appelé lorsque l'animation est terminée

  return (
    <div className="min-h-screen text-gray-100 transition-all duration-700 ease-in-out bg-gradient-to-b from-black via-gray-900 to-purple-900">
      <NeonCursor />
      <div className='fixed inset-0 bg-[url("/grid.svg")] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20'></div>

      {!isSidebarVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 hidden p-2 text-white transition rounded-full shadow-lg top-4 left-4 bg-black/60 hover:bg-black/80 md:block"
        >
          <Menu size={28} />
        </button>
      )}

      <Navbar />

      <div className="flex">
        <div className="hidden md:block">
          <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
        </div>
        <div className="container z-10 flex-1 px-4 py-8 mx-auto">
          <Routes>
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePostPages />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route
              path="/community/create"
              element={<CreateCommunityPages />}
            />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:id" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>

      {/* Barre d'icônes mobile en bas */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 border-t bg-black/80 border-white/10 md:hidden">
        <button
          type="button"
          className="flex flex-col text-gray-300 hover:text-white"
        >
          <House size={24} />
        </button>
        <Link
          to="/communities"
          className="flex flex-col text-gray-300 hover:text-white"
        >
          <Users size={24} />
        </Link>
        <Link
          to="/chat"
          className="flex flex-col text-gray-300 hover:text-white"
        >
          <MessageCircleMore size={24} />
        </Link>
        <Link
          to="/profile"
          className="flex flex-col text-gray-300 hover:text-white"
        >
          <UserIcon size={24} />
        </Link>
      </nav>
      {/* <canvas id="canvas" style={{position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 10000}} /> */}
    </div>
  );
}

export default App;
