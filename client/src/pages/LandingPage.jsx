import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import TestimonialSection from '../components/TestimonialSection';
import NewsletterSection from '../Newsletter';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <TestimonialSection/>
       <NewsletterSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
