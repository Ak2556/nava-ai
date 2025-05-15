import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

const config: Config = {
  mode: "jit",
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  safelist: [
    'bg-dotted-grid-light',
    'bg-dotted-grid-dark',
    'bg-grid-20',
    'dark:bg-dotted-grid-dark',
    'dark:bg-grid-20',
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        navaBlack: "#111111",
        navaWhite: "#fafafa",
        navaGray: "#d1d1d1",
        translucentWhite: "rgba(255, 255, 255, 0.06)",
        translucentDark: "rgba(17, 17, 17, 0.7)",
        accent: {
          light: '#ff4b5c',
          DEFAULT: '#e10d0d',
          dark: '#c10707',
        },
      },
      fontFamily: {
        nothing: ['"DotGothic16"', 'monospace', "'Space Mono'", "monospace"],
        'dot-matrix': ['"dot-matrix"', 'monospace'],
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        xl: "1rem",
      },
      keyframes: {
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        slideIn: { '0%': { transform: 'translateY(4px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        dots: { '0%': { content: '"."' }, '33%': { content: '".."' }, '66%': { content: '"..."' } },
        subtlePulse: { '0%': { boxShadow: '0 0 0 rgba(0,0,0,0)' }, '50%': { boxShadow: '0 0 6px rgba(0,0,0,0.08)' }, '100%': { boxShadow: '0 0 0 rgba(0,0,0,0)' } },
        messagePop: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        typewriter: { 'from': { width: '0' }, 'to': { width: '100%' } },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        slideIn: 'slideIn 0.3s ease-out both',
        dots: 'dots 1s steps(3,end) infinite',
        subtlePulse: 'subtlePulse 2.4s ease-in-out infinite',
        bubblePop: 'messagePop 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        typewriter: 'typewriter 2.5s steps(30,end)',
      },
      backgroundImage: {
        'dotted-grid-light': 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
        'dotted-grid-dark': 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-12': '12px 12px',
        'grid-20': '20px 20px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-light)',
          },
        },
        dark: {
          css: {
            color: 'var(--text-dark)',
          },
        },
      },
    },
  },
  plugins: [
    typography(),
    forms,
    aspectRatio,
    containerQueries,
    animate,
  ],
};

export default config;