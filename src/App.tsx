import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar"; // Correction apportée ici
import { CreatePostPages } from "./pages/CreatePostPages";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPages } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignUpForm } from "./components/SignUpForm";
import { SignInForm } from "./components/SignInForm";
import Chat from "./pages/Chat";
import { Sidebar } from "./components/Sidebar"; // Importation de la Sidebar
import { useState } from "react"; // Importation de useState pour gérer l'état de la Sidebar
import { Menu } from "lucide-react";

function App() {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // État pour gérer la visibilité de la Sidebar

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen text-gray-100 transition-all duration-700 ease-in-out bg-gradient-to-b from-black via-gray-900 to-purple-900">
      <div className='fixed inset-0 bg-[url("/grid.svg")] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20'></div>
      {/* Bouton menu flottant toujours visible */}
      {!isSidebarVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 text-white bg-black/60 rounded-full shadow-lg hover:bg-black/80 transition"
        >
          <Menu size={28} />
        </button>
      )}
      <Navbar /> {/* Suppression des props inutilisées */}
      <div className="flex">
        <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} /> {/* Connexion de l'état et de la fonction de bascule */}
        <div className="flex-1 container z-10 px-4 py-8 mx-auto">
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
