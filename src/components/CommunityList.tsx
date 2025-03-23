import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });
  if (isLoading) {
    return <div>Loading Communities...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Communautés
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((community) => (
          <div
            key={community.id}
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Link
              to={`/community/${community.id}`}
              className="relative z-10"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                {community.name}
              </h3>
              <p className="text-gray-400 mt-3 line-clamp-3">{community.description}</p>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(community.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Membres
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
