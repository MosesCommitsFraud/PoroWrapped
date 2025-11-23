'use client';

import WrappedInput from '@/components/WrappedInput';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 max-w-3xl animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-lg">
            Your League Journey, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Wrapped.
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md font-light">
            Analyze your performance, relive your best moments, and share your season highlights with the world.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-md relative group">
           <WrappedInput />
        </div>
      </div>
    </main>
  );
}
