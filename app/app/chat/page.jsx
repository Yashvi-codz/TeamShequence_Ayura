'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    const token = Cookies.get('token');
    try {
      const res = await fetch('/api/chat/send', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.messages) {
        const formatted = data.messages.flatMap(m => [
          { role: 'user', content: m.userMessage, timestamp: m.createdAt },
          { role: 'assistant', content: m.aiResponse, timestamp: m.createdAt }
        ]);
        setMessages(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    
    const token = Cookies.get('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const doshaResult = JSON.parse(localStorage.getItem('doshaResult') || '{}');
    
    const context = {
      dosha: doshaResult.dominant || 'pitta',
      recentSleep: 7,
      recentStress: 5,
      recentDigestion: 7,
      healthGoals: user.healthGoals || []
    };
    
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text, context })
      });
      
      const data = await res.json();
      const aiMsg = { role: 'assistant', content: data.aiResponse, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const quickPrompts = [
    'What should I eat today?',
    'How to balance my dosha?',
    'Why am I stressed lately?',
    "What's my ideal daily routine?"
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-cream to-primary-light/30">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-dark-text">💬 Chat with Ayura</h1>
          <p className="text-gray-text">Your personalized wellness companion</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🕉️</div>
              <h2 className="text-2xl font-bold mb-4 text-dark-text">How can I help you today?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-primary transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white text-dark-text shadow-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-md">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
            placeholder="Ask Ayura anything about your wellness..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            disabled={loading || typing}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading || typing}
            className="btn-primary disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}