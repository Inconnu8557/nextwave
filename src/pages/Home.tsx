import { useEffect, useState } from "react";
import { PostList } from "../components/PostList";
import 'ldrs/react/Ring.css'
import { Ring } from "ldrs/react";

export const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulez un chargement de données
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Remplacez par votre logique de chargement réelle

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-10">
      {loading ? (
        <div className="pt-20 text-3xl text-center">Chargement... <br /><br /><br /><Ring
        size="100"
        speed="3"
        color="purple" 
      /></div> // Loader
      ) : (
        <>
          <h2 className="pt-12 mb-6 text-6xl font-bold text-center text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
            Recent Posts
          </h2>
          <div className="pt-3.5">
            <PostList />
          </div>
        </>
      )}
    </div>
  );
};