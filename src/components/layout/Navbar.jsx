import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '../ui/index.jsx';
import '../layout/layout.css';

export const Navbar = ({ onGoHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogoClick = () => {
    setIsOpen(false);
    if (onGoHome) onGoHome();
    else navigate('/');
  };

  const handleStartClick = () => {
    setIsOpen(false);
    navigate('/triage/consent');
  };

  const links = [
    { to: '/', label: 'Accueil', end: true },
    { to: '/comment-ca-marche', label: 'Fonctionnement' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
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

          {/* Mobile Burger */}
          <button
            className={`navbar-burger${isOpen ? ' open' : ''}`}
            aria-label="Ouvrir le menu"
            onClick={toggleMenu}
          >
            {isOpen
              ? <X size={22} strokeWidth={2.5} />
              : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer no-print${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-drawer-inner">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="mobile-drawer-cta">
            <button className="navbar-cta-btn" style={{ width: '100%' }} onClick={handleStartClick}>
              Aidez-moi →
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="mobile-overlay no-print" onClick={() => setIsOpen(false)} />
      )}
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
