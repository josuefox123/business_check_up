import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Compass, HelpCircle, Mail } from 'lucide-react';
import { Button } from '../ui/index.jsx';
import logoImg from '../../assets/logo_compact.png';
import '../layout/layout.css';

export const Navbar = ({ onGoHome }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const checkAdminAuth = () =>
    Boolean(localStorage.getItem('admin_token')) || sessionStorage.getItem('admin_authenticated') === 'true';

  const [isAdminConnected, setIsAdminConnected] = useState(checkAdminAuth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Re-check on route changes (covers login redirect back to landing page) & close drawer
  useEffect(() => {
    setIsAdminConnected(checkAdminAuth());
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Listen for storage events (cross-tab logout)
  useEffect(() => {
    const onStorage = () => setIsAdminConnected(checkAdminAuth());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Close drawer on Escape key and freeze body scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDrawerOpen(false);
    };
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleLogoClick = () => {
    setIsDrawerOpen(false);
    if (onGoHome) {
      onGoHome();
    } else {
      navigate('/');
    }
  };

  const links = [
    { to: '/', label: 'Accueil', end: true, icon: Home },
    { to: '/comment-ca-marche', label: "Comment ça marche ?", icon: Compass },
    { to: '/a-propos', label: 'À propos', icon: HelpCircle },
    { to: '/contact', label: 'Contact', icon: Mail },
  ];

  const isDiagnosticFlow = location.pathname.startsWith('/triage') || location.pathname.startsWith('/diagnostic') || location.pathname === '/catalog';

  return (
    <>
      <nav className="navbar no-print">
        <div className="navbar-inner">
          {/* Logo */}
          <button className="navbar-logo" onClick={handleLogoClick} aria-label="Accueil" type="button">
            <img src={logoImg} alt="FUND.lab Logo" className="navbar-logo-img" />
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

          {/* Right Side: CTA Desktop & Mobile Burger */}
          <div className="navbar-right">
            {isAdminConnected && (
              <div className="navbar-cta no-print">
                <button type="button" className="navbar-cta-btn" onClick={() => navigate('/admin')}>
                  Dashboard
                </button>
              </div>
            )}

            {!isDiagnosticFlow && (
              <button
                type="button"
                className="navbar-burger"
                onClick={() => setIsDrawerOpen((prev) => !prev)}
                aria-label={isDrawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isDrawerOpen}
              >
                {isDrawerOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation (Option A) */}
      {!isDiagnosticFlow && (
        <>
          {isDrawerOpen && (
            <div
              className="mobile-overlay"
              onClick={() => setIsDrawerOpen(false)}
              aria-hidden="true"
            />
          )}

          <div
            className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}
            aria-hidden={!isDrawerOpen}
          >
            <div className="mobile-drawer-header">
              <img src={logoImg} alt="FUND.lab" className="mobile-drawer-logo-img" />
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-inner">
              <nav className="mobile-drawer-nav">
                {links.map(({ to, label, end, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <Icon size={18} className="mobile-nav-icon" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>

              {isAdminConnected && (
                <div className="mobile-drawer-cta">
                  <button
                    type="button"
                    className="navbar-cta-btn"
                    style={{ width: '100%', textAlign: 'center' }}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/admin');
                    }}
                  >
                    Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const ScreenWrapper = ({ children, wide = false, className = '' }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleFocusIn = (e) => {
      const target = e.target;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
      ) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    return () => window.removeEventListener('focusin', handleFocusIn);
  }, []);

  return (
    <div className={`screen-wrapper ${className}${wide ? ' wide' : ''}`}>
      <div className={wide ? 'screen-inner-wide' : 'screen-inner'}>
        {children}
      </div>
    </div>
  );
};
