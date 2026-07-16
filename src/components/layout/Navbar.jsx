import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, Home, Compass, HelpCircle, Mail } from 'lucide-react';
import { Button } from '../ui/index.jsx';
import '../layout/layout.css';

export const Navbar = ({ onGoHome }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onGoHome) onGoHome();
    else navigate('/');
  };

  const handleStartClick = () => {
    navigate('/triage/consent');
  };

  const links = [
    { to: '/', label: 'Accueil', end: true, icon: Home },
    { to: '/comment-ca-marche', label: 'Fonctionnement', icon: Compass },
    { to: '/a-propos', label: 'À propos', icon: HelpCircle },
    { to: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <>
      <nav className="navbar no-print">
        <div className="navbar-inner">
          {/* Logo */}
          <button className="navbar-logo" onClick={handleLogoClick} aria-label="Accueil FUND.lab">
            <div className="navbar-logo-icon">
              <Zap size={18} strokeWidth={3} color="var(--color-primary)" />
            </div>
            <span className="navbar-logo-name">FUND<span className="navbar-logo-dot">.lab</span></span>
          </button>

          {/* Desktop Nav */}
          <ul className="navbar-links" role="navigation">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA Desktop */}
          <div className="navbar-cta no-print">
            <button className="navbar-cta-btn" onClick={handleStartClick}>
              Aidez-moi
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab navigation */}
      <nav className="bottom-nav no-print">
        {links.map(({ to, label, end, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={22} className="bottom-nav-icon" />
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export const ScreenWrapper = ({ children, wide = false }) => (
  <div className={`screen-wrapper${wide ? ' wide' : ''}`}>
    <div className={wide ? 'screen-inner-wide' : 'screen-inner'}>
      {children}
    </div>
  </div>
);
