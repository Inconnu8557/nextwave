import ReactMarkdown from 'react-markdown';

interface PostProps {
  post: {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    // ... other post properties
  };
}

export const Post = ({ post }: PostProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="mb-4 rounded-lg" />
      )}
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};