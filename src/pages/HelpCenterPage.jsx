import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, FileText, Settings, ShieldAlert } from 'lucide-react';

const HelpCenterPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="container py-16">
      <Link to="/" className="text-accent-primary hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
        <div className="relative mt-8">
          <input 
            type="text" 
            className="input-base pl-12 h-14 text-lg" 
            placeholder="Search for articles, guides, and FAQs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-secondary" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="glass-card flex flex-col items-center text-center cursor-pointer hover:border-accent-primary transition-colors">
          <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center text-accent-primary mb-4">
            <HelpCircle size={24} />
          </div>
          <h3 className="font-bold mb-2">Getting Started</h3>
          <p className="text-sm text-secondary">Learn the basics of setting up your profile and posting.</p>
        </div>
        <div className="glass-card flex flex-col items-center text-center cursor-pointer hover:border-accent-primary transition-colors">
          <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center text-success mb-4">
            <Settings size={24} />
          </div>
          <h3 className="font-bold mb-2">Account Management</h3>
          <p className="text-sm text-secondary">Manage your connection settings, passwords, and links.</p>
        </div>
        <div className="glass-card flex flex-col items-center text-center cursor-pointer hover:border-accent-primary transition-colors">
          <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center text-warning mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-bold mb-2">Opportunities</h3>
          <p className="text-sm text-secondary">How to discover, apply to, and post new open jobs.</p>
        </div>
        <div className="glass-card flex flex-col items-center text-center cursor-pointer hover:border-accent-primary transition-colors">
          <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center text-error mb-4">
            <ShieldAlert size={24} />
          </div>
          <h3 className="font-bold mb-2">Trust & Safety</h3>
          <p className="text-sm text-secondary">Reporting abusive behavior and community guidelines.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto glass-card">
        <h2 className="text-2xl font-bold mb-6 border-b border-glass pb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <details className="bg-surface-elevated p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold text-lg list-none focus:outline-none flex justify-between">
              How do I join a Circle? <span>+</span>
            </summary>
            <p className="text-secondary mt-3">Navigate to the "Circles" tab in the navigation bar. Browse the list of communities and click "Join Circle". By entering the circle, you automatically join the live group chat.</p>
          </details>
          <details className="bg-surface-elevated p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold text-lg list-none focus:outline-none flex justify-between">
              Is my profile public? <span>+</span>
            </summary>
            <p className="text-secondary mt-3">Yes, currently all profiles mapped to posts on the Feed and inside Circles are public. A private mode is coming soon.</p>
          </details>
          <details className="bg-surface-elevated p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold text-lg list-none focus:outline-none flex justify-between">
              How do I post a job opportunity? <span>+</span>
            </summary>
            <p className="text-secondary mt-3">Go to the Opportunities page and click "Post Opportunity". Fill out the required details and press Submit.</p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
