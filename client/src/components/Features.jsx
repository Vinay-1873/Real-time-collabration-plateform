import React from 'react';
import FeatureCard from './FeatureCard';

function Features() {
  const features = [
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Experience instant synchronization across all devices with our optimized real-time engine.'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Communicate with your team instantly with built-in messaging and notifications.'
    },
    {
      icon: '📁',
      title: 'File Sharing',
      description: 'Share documents, images, and files securely with your collaborators.'
    },
    {
      icon: '🎨',
      title: 'Collaborative Editing',
      description: 'Edit documents together in real-time and see changes as they happen.'
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Stay updated with intelligent notifications that keep you in the loop.'
    },
    {
      icon: '🌐',
      title: 'Cross-Platform',
      description: 'Access your workspace from anywhere, on any device, at any time.'
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Powerful Features
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16">
          Everything you need to collaborate effectively
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
