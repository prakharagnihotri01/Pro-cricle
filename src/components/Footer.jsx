import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="glass" style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', padding: '3rem 0', backgroundColor: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="brand mb-4 inline-flex">
              <span className="brand-logo">PC</span>
              <span className="brand-text text-gradient">ProCircle</span>
            </Link>
            <p className="text-sm text-secondary max-w-sm mt-4">
              The ultimate professional networking ecosystem for students, freelancers, developers, and founders to connect and grow.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="flex flex-col gap-3 text-sm text-secondary">
              <li><Link to="/feed" className="hover:text-primary transition-colors">Feed</Link></li>
              <li><Link to="/circles" className="hover:text-primary transition-colors">Circles</Link></li>
              <li><Link to="/opportunities" className="hover:text-primary transition-colors">Opportunities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="flex flex-col gap-3 text-sm text-secondary">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-glass text-sm text-secondary gap-4">
          <p>&copy; {new Date().getFullYear()} ProCircle. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-accent-primary transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-accent-primary transition-colors">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-accent-secondary transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
