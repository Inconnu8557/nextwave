import { useEffect, useState } from "react";
import { PostList } from "../components/PostList";
import { motion } from "motion/react";
import { Ring } from "ldrs/react";
import { 
  Sparkles, 
  Plus, 
  Flame, 
  Clock, 
  Star,
  Code2,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TrendingCommunities } from "../components/TrendingCommunities";
import { TopContributors } from "../components/TopContributors";
import { DailyActivity } from "../components/DailyActivity";

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pour-vous' | 'trending' | 'recent'>('pour-vous');
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Ring size={60} speed={2} color="#3b82f6" />
          <p className="mt-4 text-slate-400">Chargement de votre feed...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main Feed - Centre */}
        <div className="lg:col-span-8">
          {/* Welcome Banner pour nouveaux utilisateurs */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-8 overflow-hidden rounded-2xl"
            >
              {/* Background with gradient and pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700" />
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
              
              <div className="relative p-8 md:p-10">
                <div className="max-w-4xl mx-auto">
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    {/* Content */}
                    <div className="text-center md:text-left">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4"
                      >
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-200 border rounded-full bg-white/10 backdrop-blur-sm border-white/20">
                          🎉 Nouveau sur NextWave ?
                        </span>
                        <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                          Rejoignez la communauté des 
                          <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text"> créateurs</span>
                        </h1>
                        <p className="mb-6 text-lg leading-relaxed text-blue-100 md:text-xl">
                          Partagez vos projets, découvrez des innovations et connectez-vous avec des développeurs du monde entier.
                        </p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start"
                      >
                        <Link 
                          to="/signup" 
                          className="relative flex items-center justify-center gap-2 px-8 py-4 font-semibold text-blue-600 transition-all duration-200 bg-white shadow-xl group rounded-xl hover:bg-blue-50 hover:shadow-2xl hover:scale-105"
                        >
                          <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
                          Créer un compte
                        </Link>
                        <Link 
                          to="/signin" 
                          className="flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 border bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 border-white/20 hover:border-white/40"
                        >
                          Se connecter
                        </Link>
                      </motion.div>
                      
                      {/* Stats */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="pt-6 mt-8 border-t border-white/20"
                      >
                        <div className="flex items-center justify-center gap-8 text-center md:justify-start">
                          <div>
                            <div className="text-2xl font-bold text-white">1.2k+</div>
                            <div className="text-xs text-blue-200 opacity-80">Projets</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">850+</div>
                            <div className="text-xs text-blue-200 opacity-80">Membres</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">24/7</div>
                            <div className="text-xs text-blue-200 opacity-80">Support</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Visual */}
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", damping: 20 }}
                      className="relative items-center justify-center hidden md:flex"
                    >
                      <div className="relative">
                        {/* Main rocket */}
                        <div className="flex items-center justify-center w-32 h-32 shadow-2xl bg-gradient-to-br from-white to-blue-100 rounded-3xl">
                          <Rocket className="w-16 h-16 text-blue-600" />
                        </div>
                        
                        {/* Floating elements */}
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute flex items-center justify-center w-12 h-12 bg-yellow-400 shadow-lg -top-4 -right-4 rounded-2xl"
                        >
                          <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                          className="absolute flex items-center justify-center w-10 h-10 bg-green-400 shadow-lg -bottom-2 -left-4 rounded-xl"
                        >
                          <Code2 className="w-5 h-5 text-white" />
                        </motion.div>
                        
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute w-4 h-4 transform -translate-x-1/2 bg-pink-400 rounded-full shadow-lg -top-8 left-1/2"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Create Post Quick Action */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 card-base"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  {user.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <Link 
                  to="/create"
                  className="flex-1 px-4 py-3 transition-all duration-200 cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-300"
                >
                  Quoi de neuf ? Partagez votre projet...
                </Link>
                <div className="flex gap-2">
                  <button className="p-2 transition-all rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10">
                    <Code2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 transition-all rounded-lg text-slate-400 hover:text-green-400 hover:bg-green-500/10">
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Feed Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 p-1 mb-6 bg-slate-800/50 rounded-xl"
          >
            <TabButton
              isActive={activeTab === 'pour-vous'}
              onClick={() => setActiveTab('pour-vous')}
              icon={<Star className="w-4 h-4" />}
              text="Pour vous"
            />
            <TabButton
              isActive={activeTab === 'trending'}
              onClick={() => setActiveTab('trending')}
              icon={<Flame className="w-4 h-4" />}
              text="Tendances"
            />
            <TabButton
              isActive={activeTab === 'recent'}
              onClick={() => setActiveTab('recent')}
              icon={<Clock className="w-4 h-4" />}
              text="Récents"
            />
          </motion.div>

          {/* Feed Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PostList />
          </motion.div>
        </div>

        {/* Right Sidebar - Widgets */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky space-y-6 top-24">
            {/* Trending Communities */}
            <TrendingCommunities />

            {/* Daily Activity */}
            <DailyActivity />

            {/* Top Contributors */}
            <TopContributors />
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant TabButton
const TabButton = ({ 
  isActive, 
  onClick, 
  icon, 
  text 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  text: string; 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{text}</span>
  </button>
);  
