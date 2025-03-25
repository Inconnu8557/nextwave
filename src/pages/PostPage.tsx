import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";
import { useNavigate } from 'react-router-dom';

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige vers la page d'accueil si la page est rechargée
    navigate('/');
  }, [navigate]);

  return (
    <div className="pt-10">
      <div>
        <PostDetail postId={Number(id)}/>
      </div>
    </div>
  );
};
