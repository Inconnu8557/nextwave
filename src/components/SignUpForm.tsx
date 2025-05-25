import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signUpWithEmail(email, password, username);
      navigate("/verify-email");
    } catch (err) {
      // Affiche le message d'erreur détaillé de Supabase si disponible
      const errorObj = err as { message?: string; status?: string | number };
      if (errorObj?.message) {
        setError(`${errorObj.message}${errorObj.status ? ` (code: ${errorObj.status})` : ""}`);
      } else {
        setError(JSON.stringify(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md p-8 mx-auto border rounded-xl bg-white/5 backdrop-blur-sm border-white/10">
      <h2 className="mb-6 text-2xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
        Créer un compte
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-2 text-sm text-gray-300">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-sm text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm text-gray-300">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-16 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute px-2 py-1 text-xs text-purple-400 -translate-y-1/2 top-1/2 right-3 hover:text-purple-300 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <Eye/> : <EyeOff/>}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 rounded bg-red-500/10">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Création du compte..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};