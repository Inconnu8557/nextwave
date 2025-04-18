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

function App() {
  return (
    <div className="min-h-screen text-gray-100 transition-all duration-700 ease-in-out bg-gradient-to-b from-black via-gray-900 to-purple-900">
      <div className='fixed inset-0 bg-[url("/grid.svg")] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20'></div>
      <Navbar />
      <div className="container z-10 px-4 py-8 mx-auto">
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
