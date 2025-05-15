'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import AuthModal from '../src/components/AuthModal';
import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // On mount, fetch current user if token exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tk = localStorage.getItem('nava-token');
      if (tk) {
        fetch('http://localhost:8000/auth/me', {
          headers: { Authorization: `Bearer ${tk}` },
        })
          .then(res => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
          })
          .then(data => setUser(data.user))
          .catch(() => setUser(null));
      }
    }
  }, []);

  const handleLogin = () => setShowModal(true);
  const handleLogout = () => {
    localStorage.removeItem('nava-token');
    setUser(null);
  };
  const handleLoginSuccess = (userData: { username?: string; email?: string }) => {
    setUser(userData);
    setShowModal(false);
  };

  return (
    <html lang="en" className="h-full">
      <head />
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-50 custom-scrollbar">
        <Head>
          <title>Nava AI</title>
          <meta name="description" content="Minimal AI Chat Interface by Akash" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>

        {/* Skip link for screen readers */}
        <a
          href="#mainContent"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 p-2 bg-white/80 text-black rounded dark:bg-black/80"
        >
          Skip to content
        </a>

        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleLoginSuccess}
        />

        <main
          id="mainContent"
          role="main"
          tabIndex={-1}
          className="flex-grow flex items-start justify-center pt-20 pb-8 focus:outline-none"
        >
          <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-4 apple-glass rounded-3xl shadow-xl ring-1 ring-black/10 animate-slideIn">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}