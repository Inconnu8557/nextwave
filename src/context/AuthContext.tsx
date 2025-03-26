import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType {
  user: User | null;
  signInWithGithub: () => void;
  signOut: () => void;
  updateUser: (user_name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGithub = () => {
    supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  const updateUser = async (user_name: string) => {
    if (!user) return;

    try {
      // Mettre à jour le nom d'utilisateur dans la table auth.users
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          user_name: user_name,
        },
      });

      if (authError) {
        console.error("Error updating user data in auth.users:", authError);
        throw authError;
      }

      // Mettre à jour le nom d'utilisateur dans la table des posts
      const { error: postError } = await supabase
        .from("posts") // Remplacez "posts" par le nom de votre table de posts
        .update({ user_name: user_name })
        .eq("avatar_url", user.user_metadata.avatar_url); // Remplacez "avatar_url" par le nom de la colonne contenant l'URL de l'avatar

      if (postError) {
        console.error("Error updating user data in posts table:", postError);
        throw postError;
      }

      // Mettre à jour l'état local avec les nouvelles données utilisateur
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          user_name: user_name,
        },
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      // Gérer l'erreur (par exemple, afficher un message d'erreur à l'utilisateur)
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGithub, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};