import React from 'react';

function FloatingCard({ icon, text, position, delay }) {
  return (
    <div className={`absolute ${position} bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 ${delay}`}>
      <div className="text-4xl">{icon}</div>
      <div className="font-semibold text-gray-900">{text}</div>
    </div>
  );
}

export default FloatingCard;
