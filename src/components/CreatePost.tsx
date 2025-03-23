import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">Créer un nouveau post</h2>
      
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Titre
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          Contenu
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          rows={5}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="community" className="block text-sm font-medium text-gray-300">
          Sélectionner une communauté
        </label>
        <select 
          id="community" 
          onChange={handleCommunityChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        >
          <option value="">-- Sélectionner une communauté --</option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id} className="bg-gray-800">
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-300"
        >
          Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg hover:border-purple-500/50 transition-colors">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-400">
              <label
                htmlFor="image"
                className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
              >
                <span>Télécharger un fichier</span>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
      >
        {isPending ? "Publication en cours..." : "Publier"}
      </button>

      {isError && (
        <p className="text-red-500 text-center">Erreur lors de la création du post.</p>
      )}
    </form>
  );
};
