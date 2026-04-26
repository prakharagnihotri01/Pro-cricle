import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Star, Target, Shield, Users, Zap } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="badge mb-6 animate-fade-in inline-flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-full border border-glass text-sm font-medium">
            <Zap size={16} className="text-warning" /> ProCircle 2.0 is Live!
          </div>
          <h1 className="hero-title animate-fade-in delay-100">
            Where Ambition Meets <br />
            <span className="text-gradient">Opportunity.</span>
          </h1>
          <p className="hero-description animate-fade-in delay-200">
            ProCircle combines the best of professional networks, freelancer platforms, and developer communities into one powerful ecosystem. 
            Whether you're a student, developer, freelancer, or founder—find your circle.
          </p>
          <div className="hero-actions animate-fade-in delay-300 w-full flex-col md:flex-row flex items-center">
            <Link to="/feed" className="btn btn-primary w-full-mobile text-lg px-8 py-3">Join the Network</Link>
            <Link to="/circles" className="btn btn-secondary w-full-mobile text-lg px-8 py-3">Explore Circles</Link>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
      </section>

      {/* Features Preview */}
      <section className="features bg-surface py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to <span className="text-gradient">grow your career</span></h2>
            <p className="text-secondary max-w-2xl mx-auto">Stop hopping between 5 different apps. ProCircle brings networking, community discussion, and job finding into a single, seamless platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card feature-card">
              <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center text-accent-primary mb-6">
                <Network size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Engaging Feed</h3>
              <p className="text-secondary leading-relaxed">Share your thoughts, like, comment, and reshare content from your network. Stay updated with industry trends directly from your connections.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center text-accent-secondary mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Niche Circles</h3>
              <p className="text-secondary leading-relaxed">Join hyper-focused communities based on your skills, interests, and goals. Connect instantly with members through built-in Circle messaging.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center text-success mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Endless Opportunities</h3>
              <p className="text-secondary leading-relaxed">Find your next big freelance gig, startup co-founder, or full-time position through our unified, smart-matching job board.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Loved by Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Sarah J.", role: "Frontend Engineer", quote: "I joined the React Circle and found my current startup co-founder within 2 days. The UI is incredibly smooth.", rating: 5 },
              { name: "David M.", role: "Freelance Designer", quote: "The Opportunities board is brilliant. No more scrolling through messy freelance sites—everything is vetted and professional.", rating: 5 },
              { name: "Elena K.", role: "Product Manager", quote: "The Feed feels much more authentic than LinkedIn. People are actually sharing knowledge instead of humble brags.", rating: 4 }
            ].map((t, i) => (
              <div key={i} className="glass-card flex flex-col hover:border-accent-primary transition-colors">
                <div className="flex text-warning mb-4">
                  {[...Array(t.rating)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <p className="text-secondary italic mb-6 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-surface border border-glass flex justify-center items-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-secondary">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-primary opacity-10"></div>
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to upgrade your network?</h2>
          <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">Join thousands of professionals already using ProCircle to advance their careers, find jobs, and build meaningful relationships.</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link to="/feed" className="btn btn-primary w-full-mobile text-lg px-8 py-3">Get Started for Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
