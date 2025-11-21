'use client';

import WrappedInput from '@/components/WrappedInput';
import DevMode from '@/components/DevMode';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg')] bg-cover bg-center opacity-10 blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/80 to-[#0a0a0c]"></div>

      <div className="z-10 w-full max-w-4xl px-6 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6 tracking-tight">
            Poro Wrapped
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Discover your League of Legends journey. Analyze your stats, relive your best matches, and see how you performed this season.
          </p>
        </div>

        <WrappedInput />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-yellow-500 font-bold text-lg mb-2">Deep Analysis</h3>
            <p className="text-gray-400 text-sm">Get detailed insights into your playstyle, champion pools, and laning performance.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-yellow-500 font-bold text-lg mb-2">Shareable Cards</h3>
            <p className="text-gray-400 text-sm">Generate beautiful cards to share your achievements with friends and social media.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-yellow-500 font-bold text-lg mb-2">Year in Review</h3>
            <p className="text-gray-400 text-sm">Visualize your entire year of League of Legends in a stunning presentation.</p>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-600 text-sm">
          <p>Not endorsed by Riot Games.</p>
        </div>
      </div>
    </main>
  );
}

