import  { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState<{ content: string; isUser: boolean }[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const addMessage = (msg: string, isUser: boolean) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: msg, isUser },
    ]);
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      addMessage(inputMessage, true);
      setInputMessage('');

      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const aiResponse = "This is an AI response.";
        addMessage(aiResponse, false);
      }, 1000);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messages} id="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.isUser ? styles.userMessage : {}),
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div style={styles.chatInput}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    width: '80%',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: 'white', // Fond blanc
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    justifyContent: 'center',
  },
  messages: {
    height: '300px',
    overflowY: 'auto' as const,
    borderBottom: '1px solid #ddd',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f9f9f9', // Ajout d'un fond clair pour les messages
  },
  message: {
    padding: '5px',
    margin: '5px 0',
    borderRadius: '4px',
    backgroundColor: '#2c7aef', // Fond bleu
    color: 'white', // Texte blanc
  },
  userMessage: {
    textAlign: 'right' as const,
    backgroundColor: '#e0f7fa', // Fond bleu clair
    color: 'black', // Texte noir pour contraste
  },
  chatInput: {
    display: 'flex',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    marginRight: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    color: 'black', // Texte noir
    backgroundColor: 'white', // Fond blanc
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white', // Texte blanc
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Chat;