import React, { useState } from 'react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, `Vous : ${input}`]);

    try {
      const response = await puter.ai.chat(input);
      setMessages(prev => [...prev, `IA : ${response.message.content}`]);
    } catch (error) {
      console.error('Erreur lors de la communication avec l\'IA:', error);
      setMessages(prev => [...prev, 'Erreur : Impossible d\'obtenir une réponse de l\'IA.']);
    }

    setInput('');
  };

  return (
    <div className='mt-20'>
      <div className='p-4 mb-4 overflow-y-auto border border-gray-300 rounded-lg h-96'>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <input 
        className='w-full p-2 border border-gray-300 rounded'
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Tapez votre message..."
      />
      <button className="flex items-center gap-2 px-4 py-3 mt-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700" onClick={sendMessage}>Envoyer </button>
    </div>
  );
};

export default Chat;
