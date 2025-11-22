'use client';

import WrappedInput from '@/components/WrappedInput';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-12 p-6">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
          Your League Journey, <br /> Wrapped.
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Analyze your performance, relive your best moments, and share your season highlights with the world.
        </p>
      </div>

      <div className="w-full max-w-md">
        <WrappedInput />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
        <div className="p-6 rounded-xl bg-card border border-white/5 hover:border-primary/50 transition-colors group">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Deep Analysis</h3>
          <p className="text-muted text-sm">Get detailed insights into your playstyle, champion pools, and laning performance.</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-white/5 hover:border-primary/50 transition-colors group">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Shareable Cards</h3>
          <p className="text-muted text-sm">Generate beautiful cards to share your achievements with friends and social media.</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-white/5 hover:border-primary/50 transition-colors group">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Year in Review</h3>
          <p className="text-muted text-sm">Visualize your entire year of League of Legends in a stunning presentation.</p>
        </div>
      </div>
    </div>
  );
}

