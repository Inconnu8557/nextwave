import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
const fetchCommunities = async (): Promise<Community[]> => {
  const {data, error} = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const {} = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });
  return <div></div>;
};
