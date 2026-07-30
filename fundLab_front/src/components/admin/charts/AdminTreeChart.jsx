import React, { useState } from 'react';
import { Layers, UserX, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const AdminTreeChart = ({ data = {} }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  // --- Normalisation des données (Règle 9 + Règle 7) ---
  // Tous les champs sont extraits avec des fallbacks explicites nommant le champ source.
  const totalVisitors      = Number(data.total_visitors      ?? data.started       ?? 0);
  const abandonedFirst     = Number(data.abandoned_first_run ?? data.abandoned     ?? 0);
  const completedFirstOnly = Number(data.completed_first_only ?? 0);
  const completedEnrichment= Number(data.completed_enrichment ?? 0);

  const totalEvaluated = abandonedFirst + completedFirstOnly + completedEnrichment || 1;

  const pctAbandoned  = Math.round((abandonedFirst      / totalEvaluated) * 100);
  const pctFirstOnly  = Math.round((completedFirstOnly  / totalEvaluated) * 100);
  const pctEnrichment = Math.round((completedEnrichment / totalEvaluated) * 100);

  // Nœuds normalisés — pas d'évaluation conditionnelle dans le JSX (Règle 9)
  const rootNode = {
    id: 'node-start',
    title: 'Sessions Initiées',
    subtitle: 'Entrée dans le diagnostic',
    count: totalEvaluated,
    pct: 100,
    icon: Layers,
    color: '#0284C7',
    bg: '#F0F9FF',
    borderColor: '#BAE6FD',
    badgeBg: '#E0F2FE',
    statusLabel: 'Total Sessions',
  };

  const branchNodes = [
    {
      id: 'node-abandoned',
      title: 'Abandon Précoce',
      subtitle: 'Quitté avant le 1er parcours',
      count: abandonedFirst,
      pct: pctAbandoned,
      icon: UserX,
      color: '#EF4444',
      bg: '#FEF2F2',
      borderColor: '#FCA5A5',
      badgeBg: '#FEE2E2',
      statusLabel: 'Abandon',
    },
    {
      id: 'node-first-only',
      title: '1er Parcours Seul',
      subtitle: 'Sans réponse aux questions d\'enrichissement',
      count: completedFirstOnly,
      pct: pctFirstOnly,
      icon: UserCheck,
      color: '#F59E0B',
      bg: '#FFFBEB',
      borderColor: '#FDE68A',
      badgeBg: '#FEF3C7',
      statusLabel: 'Parcours Initial',
    },
    {
      id: 'node-complete',
      title: 'Parcours Complet',
      subtitle: 'Diagnostic + Enrichissement finalisé',
      count: completedEnrichment,
      pct: pctEnrichment,
      icon: ShieldCheck,
      color: '#10B981',
      bg: '#ECFDF5',
      borderColor: '#6EE7B7',
      badgeBg: '#D1FAE5',
      statusLabel: 'Converti',
    },
  ];

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px 24px 20px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
        border: '1px solid #E2E8F0',
        position: 'relative'
      }}
    >
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles size={18} color="#0284C7" />
            <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Tree Chart — Entonnoir de Conversion des Sessions
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
            Progression des utilisateurs depuis l'initiation de session jusqu'à l'enrichissement.
          </p>
        </div>

        <div style={{ background: '#F8FAFC', padding: '6px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
          Sessions totales : <strong style={{ color: '#0284C7' }}>{totalEvaluated}</strong>
        </div>
      </div>

      {/* Network Tree Chart Container */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FAFAFA 0%, #F1F5F9 100%)',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          padding: '24px 20px',
          minHeight: '260px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* SVG Connector Lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          <path d="M 230 130 C 310 130, 330 48, 410 48" fill="none" stroke="#FCA5A5" strokeWidth="2.5" strokeDasharray="5 4" />
          <path d="M 230 130 C 310 130, 330 130, 410 130" fill="none" stroke="#FDE68A" strokeWidth="2.5" />
          <path d="M 230 130 C 310 130, 330 212, 410 212" fill="none" stroke="#6EE7B7" strokeWidth="3" />
        </svg>

        {/* Tree Layout Grid */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px', alignItems: 'center', zIndex: 2 }}>

          {/* Root Node */}
          <div
            onMouseEnter={() => setHoveredNode(rootNode.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              background: '#FFFFFF',
              border: `2px solid ${hoveredNode === rootNode.id ? rootNode.color : rootNode.borderColor}`,
              borderRadius: '20px',
              padding: '18px 20px',
              boxShadow: hoveredNode === rootNode.id ? '0 10px 25px rgba(2, 132, 199, 0.2)' : '0 4px 12px rgba(15, 23, 42, 0.05)',
              transition: 'all 0.25s ease',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: rootNode.bg, color: rootNode.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: rootNode.color, letterSpacing: '0.04em' }}>
                  {rootNode.statusLabel}
                </span>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {rootNode.title}
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{rootNode.count}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: rootNode.color, background: rootNode.badgeBg, padding: '2px 8px', borderRadius: '6px' }}>
                100%
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '4px 0 0 0' }}>{rootNode.subtitle}</p>
          </div>

          {/* Branch Nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {branchNodes.map((node) => {
              const IconComp = node.icon;
              const isHovered = hoveredNode === node.id;
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    background: '#FFFFFF',
                    border: `1.5px solid ${isHovered ? node.color : node.borderColor}`,
                    borderRadius: '16px',
                    padding: '14px 18px',
                    boxShadow: isHovered ? `0 8px 20px ${node.color}25` : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: node.bg, color: node.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {node.title}
                        </h4>
                        <span style={{ fontSize: '0.66rem', fontWeight: 800, color: node.color, background: node.badgeBg, padding: '2px 6px', borderRadius: '6px' }}>
                          {node.statusLabel}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '2px 0 0 0' }}>
                        {node.subtitle}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                      {node.count}
                    </div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: node.color, marginTop: '2px' }}>
                      {node.pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
