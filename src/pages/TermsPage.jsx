import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <Link to="/" className="text-accent-primary hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      <div className="glass-card">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-secondary mb-4">Last Updated: October 2026</p>
        
        <div className="prose text-secondary flex flex-col gap-6">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using ProCircle, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree that all content you post on the Feed, in Circles, or Opportunities complies with community guidelines.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Content and Intellectual Property</h2>
            <p>You retain ownership of any intellectual property you post on ProCircle. By posting, you grant us a worldwide, non-exclusive license to display this content on the platform.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Termination</h2>
            <p>We reserve the right to suspend or terminate any account found violating these Terms, engaging in spam, or harassing other members, without prior notice.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Liability</h2>
            <p>ProCircle provides no guarantee regarding employment opportunities listed. We are a facilitator and are not liable for external agreements made between users.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
