import { supabase } from "../supabase-client";
import { Community } from "../components/CommunityList";

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error fetching communities:", error);
    throw new Error(error.message);
  }

  return (data || []) as Community[];
};