import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
  image_url?: string | null;
  link?: string | null;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PostInput>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },
  });

  const onSubmit = async (data: PostInput) => {
    if (!selectedFile) return;
    mutate({
      post: {
        ...data,
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
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const content = watch("content");

  return (
    <div className="relative">
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center p-8 bg-white/10 backdrop-blur-md rounded-2xl animate-success-modal">
            <div className="flex items-center justify-center w-16 h-16 mb-4 border-4 border-green-500 rounded-full">
              <svg
                className="w-8 h-8 text-green-500 animate-success-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-xl font-medium text-white">
              Post créé avec succès !
            </p>
            <p className="mt-2 text-gray-300">Redirection vers l'accueil...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`max-w-2xl mx-auto space-y-6 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 ${
          isSuccess ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <h2 className="mb-8 text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
          Créer un nouveau post
        </h2>

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            Titre
          </label>
          <input
            type="text"
            id="title"
            {...register("title", {
              required: "Le titre est obligatoire",
              maxLength: {
                value: 30,
                message: "Le titre ne doit pas dépasser 30 caractères",
              },
            })}
            className="w-full p-3 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-300"
            >
              Contenu (Markdown supporté)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 text-sm text-purple-400 transition-colors rounded-md hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {showPreview ? "Éditer" : "Aperçu"}
            </button>
          </div>
          {showPreview ? (
            <div className="p-3 prose prose-invert min-h-[200px] w-full rounded-lg bg-white/5 border-white/10 border">
              <ReactMarkdown>{content || "*Aucun contenu*"}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="content"
              {...register("content", {
                required: "Le contenu est obligatoire",
              })}
              className="w-full p-3 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[200px] font-mono"
              placeholder="# Titre
## Sous-titre
- Liste à puces
- Autre élément

**Texte en gras** et *texte en italique*

[Lien](https://exemple.com)"
            />
          )}
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-300"
          >
            Link(optional)
          </label>
          <input
            type="url"
            id="link"
            {...register("link")}
            className="w-full p-3 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          {errors.link && <p className="text-red-500">{errors.link.message}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="community"
            className="block text-sm font-medium text-gray-300"
          >
            Sélectionner une communauté
          </label>
          <select
            id="community"
            {...register("community_id")}
            onChange={handleCommunityChange}
            className="w-full p-3 text-gray-200 transition-all border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
              dragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/10"
            } border-dashed rounded-lg transition-colors relative`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="w-full space-y-4">
                <div className="relative w-full overflow-hidden rounded-lg aspect-video bg-black/20">
                  <img
                    src={previewUrl!}
                    alt="Aperçu"
                    className="absolute inset-0 object-contain w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute p-2 transition-colors rounded-full top-2 right-2 bg-red-500/80 hover:bg-red-500"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{selectedFile.name}</span>
                  </div>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
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
                    className="relative font-medium text-purple-400 rounded-md cursor-pointer hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
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
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedFile || isPending}
          className="w-full px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Publication en cours..." : "Publier"}
        </button>

        {isError && (
          <p className="text-center text-red-500">
            Erreur lors de la création du post.
          </p>
        )}
      </form>
    </div>
  );
};
