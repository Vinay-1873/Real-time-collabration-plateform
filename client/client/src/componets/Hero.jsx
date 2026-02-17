import React from 'react';
import FloatingCard from './FloatingCard';

function Hero({ onGetStarted }) {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Collaborate in{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Real-Time
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Experience seamless collaboration with your team. Share ideas, work together, 
            and achieve more with our real-time collaboration platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
            >
              Start Collaborating
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-600 hover:text-white hover:-translate-y-0.5 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
        
        <div className="relative h-[500px] hidden md:block">
          <FloatingCard 
            icon="👥" 
            text="Team Collaboration" 
            position="top-1/4 left-1/10" 
            delay="animate-float"
          />
          <FloatingCard 
            icon="⚡" 
            text="Real-Time Updates" 
            position="top-1/2 right-1/10" 
            delay="animate-float-delay-1"
          />
          <FloatingCard 
            icon="🔒" 
            text="Secure & Private" 
            position="bottom-1/4 left-1/5" 
            delay="animate-float-delay-2"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
