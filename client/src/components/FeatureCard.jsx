import React from 'react';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
