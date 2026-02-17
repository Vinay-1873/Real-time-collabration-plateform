import React from 'react';
import StatCard from './StatCard';

function About() {
  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50M+', label: 'Messages Sent' }
  ];

  const benefits = [
    'Real-time synchronization',
    'Secure and encrypted connections',
    'Easy to use interface',
    'Scalable for teams of any size'
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">Built for Modern Teams</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our platform brings together all the tools you need for effective collaboration. 
            Whether you're working on a project, brainstorming ideas, or managing tasks, 
            CollabSpace provides a seamless experience that keeps everyone connected.
          </p>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-lg text-gray-700 pl-2">
                ✓ {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <StatCard key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
