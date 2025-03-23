import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface CommunityInput {
  name: string;
  description: string;
}
const createCommunity = async (community: CommunityInput) => {
    const { error, data } = await supabase.from("communities").insert(community);
    if (error) throw new Error(error.message);
    return data
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const QueryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
        Créer une nouvelle communauté
      </h2>
      
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Nom de la communauté
        </label>
        <input
          type="text"
          id="name"
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          placeholder="Entrez le nom de votre communauté"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          placeholder="Décrivez votre communauté en quelques mots..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Une bonne description aide les membres à comprendre le but de votre communauté.
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        >
          {isPending ? "Création en cours..." : "Créer la communauté"}
        </button>
        {isError && (
          <p className="text-red-500 text-center mt-2">
            Erreur lors de la création de la communauté
          </p>
        )}
      </div>
    </form>
  );
};
