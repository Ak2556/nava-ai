"use client";

import './globals.css';
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const TypingDots = () => (
  <div className="flex space-x-1 animate-pulse text-gray-500">
    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
  </div>
);

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState<{ prompt: string; response: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timeout);
  }, [memory.length, loading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/openrouter", { prompt });
      const reply = res.data.response || "No response received.";
      const newEntry = { prompt, response: reply };
      setMemory((prev) => [...prev.slice(-19), newEntry]);
      setPrompt("");
    } catch (err) {
      const errorEntry = { prompt, response: "❌ Error contacting backend." };
      setMemory((prev) => [...prev.slice(-19), errorEntry]);
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-black/60 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="text-2xl font-bold tracking-tight text-indigo-400">Nava-AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full bg-indigo-600 w-10 h-10 flex items-center justify-center text-lg font-bold shadow-md border-2 border-indigo-300">N</button>
        </div>
      </nav>

      {/* Main Chat Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl flex flex-col h-[70vh] md:h-[80vh] overflow-hidden">
          {/* Chat Scroll Area */}
          <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-200">
            {memory.length === 0 && (
              <div className="text-center text-gray-400 mt-10">No conversation yet. Start by asking something!</div>
            )}

            {memory.map((entry, idx) => (
              <div key={idx} className="flex flex-col gap-2 animate-fadeIn">
                {/* User Prompt */}
                <div className="self-end max-w-[80%] bg-indigo-100 text-gray-900 rounded-xl rounded-br-none px-4 py-2 shadow transition-all duration-200 group hover:scale-[1.02]">
                  <span className="font-semibold">You: </span>
                  <span className="transition-opacity duration-200 opacity-90 group-hover:opacity-100">{entry.prompt}</span>
                </div>

                {/* AI Response */}
                <div className="self-start max-w-[80%] bg-gray-100 text-gray-900 rounded-xl rounded-bl-none px-4 py-2 shadow transition-all duration-200 group hover:scale-[1.02]">
                  <span className="font-semibold text-indigo-500">Nava: </span>
                  <span className="transition-opacity duration-200 opacity-90 group-hover:opacity-100">{entry.response}</span>
                </div>
              </div>
            ))}

            {/* Typing animation */}
            {loading && (
              <div className="self-start max-w-[80%] bg-gray-100 text-gray-900 rounded-xl rounded-bl-none px-4 py-2 shadow flex items-center gap-2">
                <span className="font-semibold text-indigo-500">Nava:</span> <TypingDots />
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Input Area */}
          <div className="bg-white/90 p-4 border-t border-gray-300 flex flex-col sm:flex-row gap-3 items-end">
            <textarea
              className="flex-1 rounded-md p-3 bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[48px] max-h-32 shadow"
              rows={2}
              placeholder="Ask me anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading}
            />
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={(e) => handleSubmit(e)}
                disabled={loading || !prompt.trim()}
                className={`px-6 py-2 rounded-md transition-all duration-200 font-bold shadow text-white ${
                  loading || !prompt.trim()
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.03]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Thinking...
                  </div>
                ) : (
                  'Send'
                )}
              </button>
              <button
                onClick={() => setMemory([])}
                className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm shadow"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 py-4 text-xs bg-black/30">
        © {new Date().getFullYear()} Nava-AI. All rights reserved.
      </footer>
    </div>
  );
}