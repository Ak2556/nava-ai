import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  const [displayedText, setDisplayedText] = useState(isUser ? content : "");
  const [isDone, setIsDone] = useState(isUser);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isUser) {
      setDisplayedText("");
      setIsDone(false);
      let index = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedText((prev) => prev + content.charAt(index));
        index++;
        if (index >= content.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsDone(true);
        }
      }, 30);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [content, isUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-2`}
      role="listitem"
      aria-label={isUser ? "User message" : "Assistant message"}
    >
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg text-sm backdrop-blur-sm bg-transparent border-2 border-dotted ${
          isUser
            ? "border-black text-black rounded-br-none"
            : "border-gray-400 text-gray-800 rounded-bl-none"
        } hover:scale-105 transition-transform duration-200`}
      >
        <span className="inline-flex">
          {displayedText}
          {!isUser && !isDone && (
            <span className="inline-block w-[1ch] bg-current animate-pulse ml-1" aria-hidden="true" />
          )}
        </span>
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 flex items-center justify-center ml-2" aria-hidden="true">
        {isUser ? (
          <div className="w-8 h-8 border-2 border-dotted border-current text-current rounded-full flex items-center justify-center font-bold">
            Y
          </div>
        ) : (
          <div className="w-8 h-8 border-2 border-dotted border-current text-current rounded-full flex items-center justify-center font-bold">
            🧠
          </div>
        )}
      </div>
    </motion.div>
  );
}
