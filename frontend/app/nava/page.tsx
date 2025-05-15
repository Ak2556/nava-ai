'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MessageList from '@/components/chat/MessageList';
import AuthModal from '@/components/AuthModal';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type User = {
  username?: string;
  email?: string;
};

export default function Page() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [tagline, setTagline] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sequence = ['Crafted. Clean. Connected.', 'Minimal. Smart. Fast.', 'Built with ⚡ by Akash | 2025'];
    let index = 0;

    const interval = setInterval(() => {
      setTagline(sequence[index]);
      index++;
      if (index === sequence.length) clearInterval(interval);
    }, 2500);

    setMessages([]);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem('nava-token');
    if (localToken) setToken(localToken);
  }, []);

  useEffect(() => {
    const fetchUser = async (tk: string) => {
      try {
        const res = await fetch('http://localhost:8000/auth/me', {
          headers: { Authorization: `Bearer ${tk}` },
        });
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    if (token) fetchUser(token);
  }, [token]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const updated: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/openrouter',
        { messages: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      setMessages([...updated, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: `⚠️ Error: ${err instanceof Error ? err.message : 'Failed to fetch response'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <main className="pt-28 min-h-screen px-4 py-6 sm:px-10 text-black font-[dot-matrix] tracking-widest relative bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:12px_12px]">
        {/* Header */}
        <motion.h1
          className="text-center text-4xl font-bold tracking-tight mb-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Nava
        </motion.h1>
        <p className="text-center text-gray-500 mb-6 text-sm">{tagline}</p>
        {!user && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition text-sm"
            >
              Login
            </button>
          </div>
        )}

        {/* Message Display */}
        <div className="max-w-3xl mx-auto w-full mb-6">
          <div className="bg-white/60 border border-dotted border-gray-300 backdrop-blur-xl rounded-xl p-4 shadow-md min-h-[400px] overflow-y-auto transition-all duration-700 ease-out">
            {messages.length === 0 && !loading ? (
              <p className="text-center text-gray-400 font-light">Start a conversation...</p>
            ) : (
              <div className="space-y-6">
                <MessageList messages={messages} loading={loading} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="max-w-3xl mx-auto w-full flex items-center gap-2 px-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-full border border-dotted border-gray-400 focus:outline-none bg-white/80 backdrop-blur-lg shadow-inner resize-none h-12 text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-900 transition-all text-sm shadow-lg"
          >
            Send
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-gray-500">
          © 2025 Nava-AI · {user ? `Logged in as ${user.username}` : 'Built with clarity'}
        </footer>

        {/* Auth Modal */}
        <AnimatePresence>
          <AuthModal
            isOpen={showModal && !user}
            onClose={() => setShowModal(false)}
            onSuccess={(userData: User) => {
              setUser(userData);
              setShowModal(false);
              const localToken = localStorage.getItem('nava-token');
              if (localToken) setToken(localToken);
            }}
          />
        </AnimatePresence>
      </main>
    </>
  );
}