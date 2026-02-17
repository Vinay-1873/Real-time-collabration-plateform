import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

function Navbar() {
  const [showModal, setShowModal] = useState(null); // 'login' or 'signup'

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleSwitchToSignup = () => {
    setShowModal('signup');
  };

  const handleSwitchToLogin = () => {
    setShowModal('login');
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">
            DocSpace
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
            <button 
              onClick={() => setShowModal('login')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={handleCloseModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
            >
              ✕
            </button>
            {showModal === 'login' && (
              <Login onClose={handleCloseModal} onSwitchToSignup={handleSwitchToSignup} />
            )}
            {showModal === 'signup' && (
              <Signup onClose={handleCloseModal} onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
