import React from 'react';

function Navbar({ onGetStarted, isLoggedIn, onLogout }) {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">
          CollabSpace
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            Features
          </a>
          <a href="#about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            About
          </a>
          <a href="#contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            Contact
          </a>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
