import React from 'react';
import Navbar from '../componets/Navbar';
import Hero from '../componets/Hero';
import Features from '../componets/Features';
import About from '../componets/About';
import CTA from '../componets/CTA';
import Footer from '../componets/Footer';


function LandingPage({ onGetStarted, isLoggedIn, onLogout }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onGetStarted={onGetStarted} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <About />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

export default LandingPage;
