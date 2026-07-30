import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Award, BarChart2 } from 'lucide-react';

export const AdminBubbleChart = ({ moduleStats = [] }) => {
  const [hoveredCode, setHoveredCode] = useState(null);
  // Un seul objet tooltip — coordonnées extraites directement de l'événement souris
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  // Normalisation des données (Règle 9)
  const safeList = Array.isArray(moduleStats) && moduleStats.length > 0 ? moduleStats : [
    { code: 'FLH-01', name: 'Diagnostic Flash', count: 42 },
    { code: 'DIF-03', name: 'Diagnostic Difficulté', count: 28 },
    { code: 'PRJ-02', name: 'Diagnostic Projet', count: 22 },
    { code: 'OPP-04', name: 'Diagnostic Opportunité', count: 18 },
    { code: 'PRO-05', name: 'Diagnostic Produit / Offre', count: 14 },
    { code: 'COM-06', name: 'Diagnostic Commercial', count: 12 },
    { code: 'FIN-07', name: 'Diagnostic Financier', count: 10 },
    { code: 'GOV-08', name: 'Diagnostic Organisation', count: 8 },
  ];

  const sorted = [...safeList].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  const maxCount = Math.max(...sorted.map(m => m.count ?? 0), 1);
  const totalExecutions = sorted.reduce((sum, m) => sum + (m.count ?? 0), 0) || 1;
  const topModule = sorted[0] || { code: 'FLH-01', name: 'Diagnostic Flash', count: 0 };

  const BUBBLE_THEMES = [
    { bg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', shadow: 'rgba(37, 99, 235, 0.3)' },
    { bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.3)' },
    { bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', shadow: 'rgba(245, 158, 11, 0.3)' },
    { bg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', shadow: 'rgba(236, 72, 153, 0.3)' },
    { bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', shadow: 'rgba(139, 92, 246, 0.3)' },
    { bg: 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)', shadow: 'rgba(6, 182, 212, 0.3)' },
    { bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', shadow: 'rgba(239, 68, 68, 0.3)' },
    { bg: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)', shadow: 'rgba(132, 204, 22, 0.3)' },
  ];

  // Handlers — utilisent e.clientX/Y : coordonnées viewport toujours fiables
  const handleEnter = (mod, e) => {
    setHoveredCode(mod.code);
    setTooltip({ visible: true, text: mod.name || mod.code, x: e.clientX, y: e.clientY });
  };

  const handleMove = (e) => {
    setTooltip(prev => prev.visible ? { ...prev, x: e.clientX, y: e.clientY } : prev);
  };

  const handleLeave = () => {
    setHoveredCode(null);
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px 24px 20px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
        border: '1px solid #E2E8F0',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <BarChart2 size={20} color="#2563EB" />
            <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Bubble Chart — Répartition des Exécutions par Diagnostic
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
            Taille relative des diagnostics selon le volume d'exécutions.
          </p>
        </div>

        <div
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Award size={18} color="#2563EB" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E40AF' }}>
            Top #1 : {topModule.name || topModule.code} ({topModule.count ?? 0} exécutions)
          </span>
        </div>
      </div>

      {/* Bubbles canvas */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FAFAFA 0%, #F1F5F9 100%)',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          padding: '36px 20px',
          minHeight: '280px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {sorted.map((mod, idx) => {
          const count = mod.count ?? 0;
          const pct = Math.round((count / totalExecutions) * 100);
          const ratio = Math.max(0.38, count / maxCount);
          const sizePx = Math.round(75 + ratio * 85);
          const theme = BUBBLE_THEMES[idx % BUBBLE_THEMES.length];
          const isTop = idx === 0;
          const isHovered = hoveredCode === mod.code;

          return (
            <div
              key={mod.code || idx}
              onMouseEnter={(e) => handleEnter(mod, e)}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              style={{
                position: 'relative',
                width: `${sizePx}px`,
                height: `${sizePx}px`,
                borderRadius: '50%',
                background: theme.bg,
                boxShadow: isHovered
                  ? `0 14px 30px ${theme.shadow}, 0 0 0 4px #FFFFFF, 0 0 0 6px ${theme.shadow}`
                  : `0 8px 20px ${theme.shadow}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                textAlign: 'center',
                padding: '8px',
                cursor: 'pointer',
                transition: 'box-shadow 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'scale(1.1) translateY(-4px)' : isTop ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              {isTop && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-2px',
                    background: '#F59E0B',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  ★
                </div>
              )}

              <span style={{ fontSize: sizePx > 110 ? '0.72rem' : '0.62rem', fontWeight: 800, opacity: 0.85, letterSpacing: '0.04em' }}>
                {mod.code}
              </span>
              <span style={{ fontSize: sizePx > 110 ? '1.4rem' : '1.1rem', fontWeight: 900, lineHeight: 1, margin: '2px 0' }}>
                {count}
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(255,255,255,0.25)', padding: '2px 7px', borderRadius: '99px' }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/*
       * Tooltip global rendu via Portal dans document.body.
       * Complètement hors du DOM de la carte, hors de tout contexte CSS transformé.
       * Position: fixed avec coordonnées e.clientX/Y — toujours dans le viewport.
       * Un seul tooltip dans le DOM à tout moment (contrôlé par tooltip.visible).
       */}
      {tooltip.visible && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: tooltip.y - 18,
            left: tooltip.x,
            transform: 'translate(-50%, -100%)',
            background: '#1E293B',
            color: '#F8FAFC',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)',
            pointerEvents: 'none',
            zIndex: 99999,
            lineHeight: 1.4,
            userSelect: 'none',
          }}
        >
          {tooltip.text}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #1E293B',
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};
