import React, { useState, useEffect } from 'react';
import logoCompact from '../../assets/logo_compact.png';

export const CountdownScreen = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isFinished: false
  });

  useEffect(() => {
    const targetDateString = "2026-07-27T08:00:00+01:00";
    const targetDate = new Date(targetDateString).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft(prev => ({ ...prev, isFinished: true }));
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isFinished: false
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: '#f8f9fa',
      backgroundImage: `
        radial-gradient(circle at 100% 0%, rgba(217, 227, 244, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 0% 100%, rgba(231, 232, 233, 0.6) 0%, transparent 50%)
      `,
      fontFamily: "'Inter', sans-serif",
      color: '#191c1d',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(225, 227, 228, 0.6)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        borderRadius: '0.75rem',
        padding: '2.5rem 1.5rem',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 10, marginBottom: '2.5rem' }}>
          <img
            src={logoCompact}
            alt="Business Check-up - Powered by FUND.lab"
            style={{ height: '56px', width: 'auto', margin: '0 auto', display: 'block' }}
          />
        </div>

        {/* Texte explicatif */}
        <div style={{ position: 'relative', zIndex: 10, marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Lancement imminent
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#44474c', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Dans le cadre de l'événement organisé par la <strong style={{ fontWeight: 600, color: '#020914' }}>Chambre de Commerce et d'Industrie du Bénin (CCIB)</strong>, la plateforme ouvrira officiellement ses portes à la fin de ce décompte.<br /><br />
            <span style={{ fontSize: '1rem', color: '#75777c' }}>Merci de votre patience.</span>
          </p>
        </div>

        {/* Compte à rebours */}
        {timeLeft.isFinished ? (
          <div style={{ padding: '2rem 0' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#1A9DB8', margin: 0, fontWeight: 600 }}>
              La plateforme est maintenant accessible.
            </h2>
          </div>
        ) : (
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem', width: '100%', padding: '1.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A' }}>{timeLeft.days}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Jours</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem', width: '100%', padding: '1.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A' }}>{timeLeft.hours}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Heures</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem', width: '100%', padding: '1.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A' }}>{timeLeft.minutes}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Minutes</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem', width: '100%', padding: '1.75rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#008196' }}>{timeLeft.seconds}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Secs</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
