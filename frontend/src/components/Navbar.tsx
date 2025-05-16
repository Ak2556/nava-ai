'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface NavbarProps {
  user: { username?: string; email?: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  // Determine login state via user prop or stored token
  const token = typeof window !== 'undefined' ? localStorage.getItem('nava-token') : null;
  const isLoggedIn = Boolean(user) || Boolean(token);

  const buttonClass = "px-3 sm:px-4 py-1 sm:py-2 rounded border-2 border-dotted border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform duration-200 hover:scale-105 active:scale-95";

  const handleLogin = () => {
    onLogin();
  };

  const handleLogout = () => {
    localStorage.removeItem('nava-token');
    onLogout();
  };


  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-lg transition-all duration-300 border-b border-dotted border-black/30"
      style={{ fontFamily: "'dot-matrix', monospace" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <a href="#mainContent" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 p-2 bg-white/80 text-black rounded">
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
        <h1>
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:underline">
            Nava AI
          </Link>
        </h1>
        <div className="flex items-center">
          <Menu as="div" className="relative">
            <Menu.Button className={buttonClass + " bg-white/10 hover:bg-white/20"}>
              <EllipsisVerticalIcon className="w-6 h-6 text-gray-700" />
            </Menu.Button>
            <Menu.Items
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={true}
            >
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={isLoggedIn ? handleLogout : handleLogin}
                    className={`w-full text-left px-4 py-2 text-sm font-mono ${
                      active ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200 transition-colors`}
                  >
                    {isLoggedIn ? "Logout" : "Login"}
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </motion.nav>
  );
}