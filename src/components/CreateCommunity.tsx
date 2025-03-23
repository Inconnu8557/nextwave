import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { data, useNavigate } from "react-router";
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
    <form onSubmit={handleSubmit}>
      <h2>Create New Community</h2>
      <div>
        <label>Community Name</label>
        <input
          type="text"
          id="name"
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          id="description"
          required
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button>{isPending ? "Creating... ": "Create Community"}</button>
      {isError && <p>Error Creating Community</p>}
    </form>
  );
};
