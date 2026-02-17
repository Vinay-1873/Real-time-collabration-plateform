import React from 'react';

function CTA({ onGetStarted }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl lg:text-5xl font-bold">
          Ready to Transform Your Collaboration?
        </h2>
        <p className="text-xl opacity-90">
          Join thousands of teams already using CollabSpace
        </p>
        <button
          onClick={onGetStarted}
          className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:-translate-y-0.5 hover:shadow-2xl transition-all"
        >
          Get Started Free
        </button>
      </div>
    </section>
  );
}

export default CTA;
