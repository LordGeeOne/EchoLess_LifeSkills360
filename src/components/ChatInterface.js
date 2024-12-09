import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

const ChatInterface = () => {
  const location = useLocation();
  // Remove background and township from destructuring since we'll use from sessionStorage
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi, I'm your AI adviser focused on addressing mental health and social challenges in South African townships. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const userMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          context: `You are an AI companion specializing in mental health and social support for South African township youth. 
                 Your responses should be:
                 - Written in simple, short clear English
                 - Include local context and references when appropriate
                 - Provide practical, actionable advice
                 - Keep responses short and to the point
                 - Be a friend, not a therapist
                 - Urge users to vent more by asking open-ended questions
                 If someone needs professional help, encourage them to seek local counseling or medical services.`
        }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (response.ok && data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        console.error('API Error:', data);
        throw new Error(data.error || 'Failed to get response from AI');
      }
    } catch (error) {
      console.error('Error details:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: 'I apologize, I\'m having trouble responding right now. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50px',
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      // Remove background: '#000' here
    }}>
      {/* Remove backgroundImage conditional check since it's handled by App.js now */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '950px',
        height: '88%',
        margin: '30px',
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.23)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '10px' // Add padding for scrollbar
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              margin: '4px 0',
              animation: 'fadeIn 0.3s ease-in-out'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'rgba(0, 123, 255, 0.2)' : 'rgba(40, 167, 69, 0.2)',
                color: '#fff',
                wordBreak: 'break-word',
                animation: `${msg.role === 'user' ? 'slideLeft' : 'slideRight'} 0.3s ease-out`
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ textAlign: 'center', color: '#fff' }}>Listening...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ 
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '10px',
          borderRadius: '24px',
          marginTop: 'auto'
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '8px 12px', // reduced from 8px 16px
              border: 'none',
              background: 'transparent',
              color: '#fff',
              outline: 'none',
              fontSize: '16px' // Added larger font size
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: '#0d6efd',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SendIcon style={{ fontSize: '20px' }} />
          </button>
        </div>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideRight {
              from { transform: translateX(-10px); opacity: 0; } /* Reduced movement */
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideLeft {
              from { transform: translateX(10px); opacity: 0; } /* Reduced movement */
              to { transform: translateX(0); opacity: 1; }
            }

            /* Scrollbar Styles */
            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 4px;
              transition: background 0.2s;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.4);
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default ChatInterface;