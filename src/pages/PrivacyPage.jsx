import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <Link to="/" className="text-accent-primary hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      <div className="glass-card">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-secondary mb-4">Last Updated: October 2026</p>
        
        <div className="prose text-secondary flex flex-col gap-6">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, update your profile, join Circles, post in the Feed, or apply for Opportunities. This includes your name, email, and authentication details via Google.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. How We Use Information</h2>
            <p>We use your information to provide, maintain, and improve ProCircle, and to match you with relevant Circles and Job Opportunities. We do not sell your personal data to third parties.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Data Storage (Firebase)</h2>
            <p>Your data is securely stored using Google Firebase. Firebases handles all authentication and data persistence. We employ standard security measures to protect your information.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Public Profile</h2>
            <p>Information you add to your profile, posts you make, and circles you join are visible to others on ProCircle. Please be mindful of sensitive information you choose to share.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
