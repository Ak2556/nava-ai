export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col items-center justify-center px-6 py-24">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-center leading-tight tracking-tight mb-6">
        Meet <span className="text-indigo-400">Nava AI</span><br />
        Your AI Co-Founder
      </h1>

      <p className="max-w-xl text-lg sm:text-xl text-gray-300 text-center mb-8">
        Score your startup ideas. Store your second brain.  
        Get weekly insights. Build faster, smarter, better — with Nava.
      </p>

      <a
        href="#"
        className="inline-block px-8 py-3 text-lg font-semibold bg-white text-gray-900 rounded-lg shadow-md hover:bg-gray-200 transition"
      >
        🚀 Join the Waitlist
      </a>
    </main>
  );
}