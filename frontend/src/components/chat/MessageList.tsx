'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

// Type definitions
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  loadingText?: string;
}

export default function MessageList({ messages, loading, loadingText }: MessageListProps) {
  const [animatedContent, setAnimatedContent] = useState('');
  const [copyStatus, setCopyStatus] = useState<{ [key: number]: boolean }>({});

  // ✨ Animate Nava's last response letter-by-letter with slowed typewriter and sentence pause
  useEffect(() => {
    if (loading && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant') {
        const chars = last.content.split('');
        setAnimatedContent('');
        let i = 0;
        const type = () => {
          const char = chars[i];
          setAnimatedContent((prev) => prev + char);
          i++;
          if (i < chars.length) {
            const delay = /[.!?]/.test(char) ? 250 : 80;
            setTimeout(type, delay);
          }
        };
        type();
      }
    }
  }, [loading, messages]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => setCopyStatus((prev) => ({ ...prev, [index]: false })), 1000);
  };

  return (
    <ul
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className="flex flex-col space-y-5 px-4 pt-6 pb-12 overflow-y-auto text-[15px] font-mono text-black"
    >
      {messages.map((msg, idx) => {
        const isAssistant = msg.role === 'assistant';
        const isLastAssistant = isAssistant && idx === messages.length - 1;

        return (
          <motion.li
            key={idx}
            role="listitem"
            aria-label={isAssistant ? 'Nava message' : 'User message'}
            className="mb-6"
            style={{
              marginTop: idx > 0 && msg.role !== messages[idx - 1].role ? '1.5rem' : '0.5rem',
            }}
          >
            <div className={`relative ${isAssistant ? 'ml-0 mr-auto' : 'ml-auto mr-0'}`}>
              <div
                className={`px-3 py-1 text-[0.9rem] border-4 border-dotted ${
                  isAssistant
                    ? 'border-black text-black rounded-none font-normal'
                    : 'border-gray-600 text-gray-600 rounded-none font-bold'
                } whitespace-pre-wrap break-words leading-tight max-w-[85%]`}
              >
                <span className="font-semibold mr-1">{isAssistant ? 'Nava:' : 'You:'}</span>{' '}
                <div className="inline">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span className="inline">{children}</span>,
                    }}
                  >
                    {isLastAssistant && loading ? animatedContent : msg.content}
                  </ReactMarkdown>
                </div>

                {/* Copy Button for Assistant */}
                {isAssistant && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    aria-label="Copy message to clipboard"
                    className="absolute bottom-1 right-2 text-xs border-4 border-dotted p-1 rounded"
                  >
                    {copyStatus[idx] ? '✅' : <FaRegCopy size={12} />}
                  </button>
                )}
              </div>
            </div>
          </motion.li>
        );
      })}

      {loading && (
        <div className="text-sm text-gray-500 mt-2 px-4">
          {loadingText || 'Nava is thinking...'}
        </div>
      )}
    </ul>
  );
}