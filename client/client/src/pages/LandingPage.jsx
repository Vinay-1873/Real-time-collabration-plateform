import React from 'react';
import Navbar from '../componets/Navbar';
import Hero from '../componets/Hero';
import Features from '../componets/Features';
import About from '../componets/About';
import CTA from '../componets/CTA';
import Footer from '../componets/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
