import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Network, Search, Briefcase, Menu, X, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogin = async () => {
    await loginWithGoogle();
  };

  const navLinks = [
    { name: 'Feed', path: '/feed', icon: <Network size={18} /> },
    { name: 'Circles', path: '/circles', icon: <Search size={18} /> },
    { name: 'Opportunities', path: '/opportunities', icon: <Briefcase size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="brand">
          <span className="brand-logo">PC</span>
          <span className="brand-text text-gradient">ProCircle</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="nav-auth-desktop">
          {currentUser ? (
            <div className="user-profile">
              <img src={currentUser.photoURL || 'https://via.placeholder.com/40'} alt="Profile" className="avatar" />
              <div className="user-info">
                <span className="user-name">{currentUser.displayName?.split(' ')[0]}</span>
              </div>
              <button className="btn-icon" onClick={logout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleLogin}>
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="btn-icon mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="mobile-auth-section">
            {currentUser ? (
              <button className="btn btn-secondary w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                Logout ({currentUser.displayName?.split(' ')[0]})
              </button>
            ) : (
              <button className="btn btn-primary w-full" onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
