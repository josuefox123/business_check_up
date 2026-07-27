import React, { useState, useEffect } from 'react';
import logoCompact from '../../assets/logo_compact.png';

export const CountdownScreen = () => {
  const [isAllowedDomain, setIsAllowedDomain] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isFinished: false
  });

  useEffect(() => {
    // 1. Restriction au nom de domaine spécifique
    const hostname = window.location.hostname;
    const allowedDomains = ['checkup.business-assist.io', 'localhost', '127.0.0.1'];

    if (allowedDomains.includes(hostname)) {
      setIsAllowedDomain(true);
    }
  }, []);

  useEffect(() => {
    // Ne pas démarrer l'intervalle si le domaine n'est pas le bon
    if (!isAllowedDomain) return;

    const targetDateString = "2026-07-27T09:00:00+01:00";
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
  }, [isAllowedDomain]);

  // Si le domaine n'est pas le bon, on ne rend rien du tout (écran vide)
  if (!isAllowedDomain) {
    return null;
  }

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
        background: '#ffffff',
        border: '1px solid rgba(225, 227, 228, 0.6)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        borderRadius: '1rem',
        maxWidth: '850px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Conteneur principal */}
        <div style={{ padding: '3.5rem 2rem 2.5rem 2rem' }}>

          {/* Logo */}
          <div style={{ marginBottom: '2.5rem' }}>
            <img
              src={logoCompact}
              alt="Business Check-up - Powered by FUND.lab"
              style={{ height: '60px', width: 'auto', margin: '0 auto', display: 'block' }}
            />
          </div>

          {/* En-tête et paragraphes */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Lancement imminent
            </h1>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#334155', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Comprenez votre situation. Identifiez vos priorités.<br />Préparez les bonnes décisions.
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '700px', margin: '0 auto 0.75rem auto', lineHeight: 1.6 }}>
              Réalisez votre Business Check-up, recevez une lecture personnalisée de votre entreprise et, lorsque cela est pertinent, approfondissez vos résultats avec un expert.
            </p>
            <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
              La <strong style={{ color: '#334155', fontWeight: 600 }}>CCI Bénin</strong> s'associe à <strong style={{ color: '#334155', fontWeight: 600 }}>FUND.lab</strong> pour lancer Business Check-up, une solution digitale destinée à aider les entrepreneurs et les PME à mieux comprendre leur situation et à agir dans le bon ordre.
            </p>
          </div>

          {/* Encadré gris contenant le décompte */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '1rem',
            padding: '2.5rem 2rem',
            maxWidth: '650px',
            margin: '0 auto',
            border: '1px solid #F1F5F9'
          }}>
            <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: '2rem', fontSize: '1rem' }}>
              La plateforme ouvre officiellement dans :
            </p>

            {timeLeft.isFinished ? (
              <div style={{ padding: '1rem 0' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#008196', margin: 0, fontWeight: 700 }}>
                  La plateforme est maintenant accessible.
                </h2>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                {/* Jours */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', width: '100%', padding: '1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>{timeLeft.days}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Jours</span>
                </div>

                {/* Heures */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', width: '100%', padding: '1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>{timeLeft.hours}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Heures</span>
                </div>

                {/* Minutes */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', width: '100%', padding: '1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>{timeLeft.minutes}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Minutes</span>
                </div>

                {/* Secondes */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', width: '100%', padding: '1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#008196' }}>{timeLeft.seconds}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Secs</span>
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
              Revenez ici dès la fin du décompte pour réaliser votre premier Business Check-up.
            </p>
          </div>

          {/* Badges Avantages */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
            <span style={{ backgroundColor: '#F0F9FA', color: '#008196', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>✓</span> RÉSULTAT IMMÉDIAT
            </span>
            <span style={{ backgroundColor: '#F0F9FA', color: '#008196', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>✓</span> RAPPORT PERSONNALISÉ
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #F1F5F9',
          padding: '1.5rem',
          backgroundColor: '#FCFDFD',
          fontSize: '0.85rem',
          color: '#94A3B8'
        }}>
          Business Check-up - Powered by <strong style={{ color: '#475569' }}>FUND.lab</strong> <span style={{ margin: '0 0.5rem', color: '#E2E8F0' }}>|</span> Lancé avec la <strong style={{ color: '#475569' }}>CCI Bénin</strong>
        </div>

      </div>
    </div>
  );
};