'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [doshaResult, setDoshaResult] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const doshaData = JSON.parse(localStorage.getItem('doshaResult') || '{}');
    setUser(userData);
    setDoshaResult(doshaData);

    // Load chat history
    fetchChatHistory();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    setLoading(true);
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
      console.error('Failed to load chat history:', err);
      // Load from localStorage as fallback
      const savedChat = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      setMessages(savedChat);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;
    
    const userMsg = { role: 'user', content: textToSend, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setTyping(true);
    
    const token = Cookies.get('token');
    const context = {
      dosha: doshaResult?.dominant || 'pitta',
      recentSleep: 7,
      recentStress: 5,
      recentDigestion: 7,
      healthGoals: user?.healthGoals || []
    };
    
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: textToSend, context })
      });
      
      const data = await res.json();
      const aiMsg = { role: 'assistant', content: data.aiResponse, timestamp: new Date() };
      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);
      
      // Save to localStorage
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date() 
      };
      const updatedMessages = [...newMessages, errorMsg];
      setMessages(updatedMessages);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the entire chat history?')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
    }
  };

  const quickPrompts = [
    {
      category: 'Diet & Nutrition',
      icon: '🍽️',
      prompts: [
        'What should I eat today based on my dosha?',
        'Suggest a breakfast that balances my constitution',
        'What foods should I avoid?',
        'How can I improve my digestion?'
      ]
    },
    {
      category: 'Wellness & Lifestyle',
      icon: '🧘',
      prompts: [
        'What\'s my ideal daily routine?',
        'How can I reduce stress naturally?',
        'Best time to exercise for my dosha?',
        'Tips for better sleep quality'
      ]
    },
    {
      category: 'Health Concerns',
      icon: '💚',
      prompts: [
        'Why do I feel tired during the day?',
        'How to balance my hormones naturally?',
        'Natural remedies for headaches',
        'How to boost my immunity?'
      ]
    },
    {
      category: 'Seasonal Tips',
      icon: '🌸',
      prompts: [
        'What to eat in summer season?',
        'Winter wellness tips for my dosha',
        'Seasonal routine adjustments',
        'Best herbs for this season'
      ]
    }
  ];

  const exampleQuestions = [
    'What should I eat today?',
    'How to balance my dosha?',
    'Why am I stressed lately?',
    "What's my ideal daily routine?"
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-cream to-primary-light/30">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 py-4 px-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/app/dashboard" className="text-primary hover:text-green-600">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-dark-text flex items-center gap-2">
                💬 Chat with Ayura
              </h1>
              <p className="text-sm text-gray-text">Your personalized wellness companion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && doshaResult && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                <span className="text-2xl">{doshaResult.dominant === 'vata' ? '🌬️' : doshaResult.dominant === 'pitta' ? '🔥' : '💧'}</span>
                <span className="font-semibold text-primary capitalize">{doshaResult.dominant}</span>
              </div>
            )}
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑️ Clear Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-5xl mb-4">🕉️</div>
                <p className="text-gray-text">Loading your conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-7xl mb-6">🕉️</div>
              <h2 className="text-3xl font-bold mb-3 text-dark-text">
                Welcome to Ayura Wellness Chat
              </h2>
              <p className="text-xl text-gray-text mb-8">
                Ask me anything about your health, diet, lifestyle, or Ayurveda
              </p>

              {/* Quick Prompt Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                {quickPrompts.map((category, idx) => (
                  <div key={idx} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{category.icon}</span>
                      <h3 className="text-lg font-bold text-dark-text">{category.category}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.prompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => sendMessage(prompt)}
                          className="w-full p-3 text-sm text-left bg-gray-50 hover:bg-primary/10 hover:border-primary border-2 border-transparent rounded-lg transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Popular Questions */}
              <div className="mt-12">
                <p className="text-sm text-gray-text mb-4">Or try these popular questions:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {exampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q)}
                      className="px-4 py-2 bg-white border-2 border-primary/30 hover:border-primary text-sm rounded-full hover:shadow-md transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex gap-3 max-w-[80%]">
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        A
                      </div>
                    )}
                    <div>
                      <div
                        className={`p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-white text-dark-text shadow-md rounded-bl-none'
                        }`}
                      >
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.timestamp && (
                        <p className="text-xs text-gray-text mt-1 px-2">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-dark-text font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !typing && sendMessage()}
              placeholder="Ask Ayura anything about your wellness..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none text-base"
              disabled={typing}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-base"
            >
              Send
            </button>
          </div>
          
          {/* Quick Actions Below Input */}
          {messages.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <p className="text-xs text-gray-text w-full mb-1">Quick suggestions:</p>
              {['Tell me more', 'What else?', 'Any alternatives?', 'Explain further'].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}