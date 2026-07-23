import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Home, Compass, HelpCircle, Mail } from 'lucide-react';
import { Button } from '../ui/index.jsx';
import logoImg from '../../assets/logo_compact.png';
import '../layout/layout.css';

export const Navbar = ({ onGoHome }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    window.location.href = 'https://fund-lab.org/';
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

  const isDiagnosticFlow = location.pathname.startsWith('/triage') || location.pathname.startsWith('/diagnostic') || location.pathname === '/catalog';

  return (
    <>
      <nav className="navbar no-print">
        <div className="navbar-inner">
          {/* Logo */}
          <button className="navbar-logo" onClick={handleLogoClick} aria-label="Accueil FUND.lab" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <img src={logoImg} alt="FUND.lab Logo" style={{ height: '38px', width: 'auto', display: 'block' }} />
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

      {/* Mobile bottom tab navigation — Hidden during diagnostic flow so the action menu bar takes its place */}
      {!isDiagnosticFlow && (
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
      )}
    </>
  );
};

export const ScreenWrapper = ({ children, wide = false }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className={`screen-wrapper${wide ? ' wide' : ''}`}>
      <div className={wide ? 'screen-inner-wide' : 'screen-inner'}>
        {children}
      </div>
    </div>
  );
};
