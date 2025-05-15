'use client';

import { useEffect, useRef, useState } from 'react';
import MessageList from '@/components/chat/MessageList';
import AuthModal from '../src/components/AuthModal';
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
  const [streaming, setStreaming] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [tagline, setTagline] = useState('');

  /* Intro tagline once */
  useEffect(() => {
    const seq = [
      'Crafted. Clean. Connected.',
      'Minimal. Smart. Fast.',
      'Built with ⚡ by Akash | 2025',
    ];
    let i = 0;
    const iv = setInterval(() => {
      setTagline(seq[i]);
      i++;
      if (i === seq.length) clearInterval(iv);
    }, 2500);
    setMessages([]);
    return () => clearInterval(iv);
  }, []);

  /* Load JWT */
  useEffect(() => {
    const tk = localStorage.getItem('nava-token');
    if (tk) setToken(tk);
  }, []);

  /* Fetch user */
  useEffect(() => {
    if (!token) return setUser(null);
    fetch('http://localhost:8000/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json().catch(() => null))
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [token]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const updated = [...messages, { role: 'user' as const, content: input }];
    setMessages(updated);
    setInput('');
    setStreaming(true);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/openrouter', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: `⚠️ Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        },
      ]);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main
      id="mainContent"
      className="mt-16 pt-6 min-h-screen px-4 py-6 sm:px-10 text-black font-[dot-matrix] tracking-widest relative bg-[radial-gradient(circle,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:16px_16px]"
    >
      {/* Heading */}
      <motion.h1
        style={{ fontFamily: "'dot-matrix', monospace" }}
        className="text-center text-4xl font-bold tracking-tight mb-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Nava
      </motion.h1>
      {/* Animated red underline */}
      <motion.span
        className="block h-[3px] bg-[var(--color-accent)] rounded-full mx-auto mb-6"
        initial={{ width: 0 }}
        animate={{ width: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <p className="text-center text-gray-500 mb-6 text-sm">{tagline}</p>

      {/* Chat window */}
      <div className="max-w-3xl mx-auto w-full mb-6">
        <div className="bg-white/60 border border-dotted border-gray-300 backdrop-blur-xl rounded-xl p-4 shadow-md min-h-[400px] overflow-y-auto">
          {messages.length === 0 && !loading ? (
            <label htmlFor="message" className="sr-only">
              Start a conversation
            </label>
          ) : (
            <div className="space-y-6">
              <MessageList messages={messages} loading={streaming} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="max-w-3xl mx-auto w-full flex items-center gap-2 px-1"
        aria-label="Chat input form"
      >
        <textarea
          name="message"
          aria-label="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow p-3 rounded-full border border-dotted border-gray-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-lg shadow-inner resize-none h-12 text-sm"
        />
        <button
          type="button"
          onClick={() => setMessages([])}
          className="bg-gray-300 text-gray-900 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors duration-200 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/50"
        >
          Clear
        </button>
        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/50"
        >
          Send
        </button>
      </form>

      {/* Footer */}
      <footer className="mt-12 py-4 border-t border-dotted border-gray-300 bg-white/50 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 font-mono">
          <a
            href="https://github.com/Ak2556/nava-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            © 2025 Nava-AI
          </a>
          <a
            href="https://www.instagram.com/akash___thakur07?igsh=NHljNDZxdTAxdGRp&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline hover:underline"
          >
            • Developed with <span className="font-sans">☕</span> and ❤️
          </a>
          {user && (
            <span>
              Logged in as {user.username || user.email}
            </span>
          )}
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="https://github.com/Ak2556/nava-ai" target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub
            </a>
            <a href="https://akashthakur.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portfolio
            </a>
            <a href="mailto:akash@example.com" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Auth modal */}
      <AnimatePresence>
        <AuthModal
          isOpen={showModal && !user}
          onClose={() => setShowModal(false)}
          onSuccess={(userData: User) => {
            setUser(userData);
            setShowModal(false);
            const tk = localStorage.getItem('nava-token');
            if (tk) setToken(tk);
          }}
        />
      </AnimatePresence>
    </main>
  );
}