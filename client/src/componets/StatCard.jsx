import React from 'react';

function StatCard({ value, label }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl text-white text-center">
      <h3 className="text-5xl font-bold mb-2">{value}</h3>
      <p className="text-xl opacity-90">{label}</p>
    </div>
  );
}

export default StatCard;
