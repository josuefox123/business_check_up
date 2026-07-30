import React, { useState } from 'react';
import { Search, MapPin, Briefcase, UserCheck } from 'lucide-react';

export const AdminBreakdownWidget = ({ topSectors = [], userProfiles = [], sectorStats = [] }) => {
  const [activeTab, setActiveTab] = useState('region');
  const [searchFilter, setSearchFilter] = useState('');

  // --- Normalisation des données (Règle 9 + Règle 7) ---
  // Les données réelles de l'API sont prioritaires.
  // En l'absence de données API, on affiche une liste vide avec un message explicite (Règle 8 — pas de mock).
  const regionData = (Array.isArray(topSectors) && topSectors.length > 0)
    ? topSectors.map(s => ({
        label: s.region ?? s.sector ?? s.label ?? '[region non disponible]',
        count: s.diagnostic_count ?? s.count ?? 0,
      }))
    : [];

  const sectorData = (Array.isArray(sectorStats) && sectorStats.length > 0)
    ? sectorStats.map(s => ({
        label: s.sector ?? s.name ?? s.label ?? '[sector non disponible]',
        count: s.diagnostic_count ?? s.count ?? 0,
      }))
    : [];

  const profileData = (Array.isArray(userProfiles) && userProfiles.length > 0)
    ? userProfiles.map(p => ({
        label: p.profile ?? p.label ?? p.type ?? '[profile non disponible]',
        count: p.diagnostic_count ?? p.count ?? 0,
      }))
    : [];

  // Dataset actif selon l'onglet sélectionné
  const rawData =
    activeTab === 'region' ? regionData :
    activeTab === 'sector' ? sectorData :
    profileData;

  const filtered = rawData.filter(item =>
    item.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalCount = rawData.reduce((sum, item) => sum + (item.count || 0), 0) || 1;
  const maxCount = Math.max(...rawData.map(item => item.count || 0), 1);

  // Palette de couleurs sémantiques ordonnées — pas de rotation aléatoire (Règle 8)
  const COLOR_PALETTE = [
    '#3B82F6', '#06B6D4', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#EF4444', '#84CC16'
  ];

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px 24px 20px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        border: '1px solid #E2E8F0',
        marginTop: '24px'
      }}
    >
      {/* Widget Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
            Répartition des Diagnostics
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
            Analyse comparative par Région, Secteur d'activité et Profil d'entreprise
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '14px', gap: '4px' }}>
          {[
            { key: 'region', label: 'Régions', icon: MapPin },
            { key: 'sector', label: 'Secteurs', icon: Briefcase },
            { key: 'profile', label: 'Profil', icon: UserCheck },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSearchFilter(''); }}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeTab === key ? '#FFFFFF' : 'transparent',
                color: activeTab === key ? '#2563EB' : '#64748B',
                boxShadow: activeTab === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder={`Filtrer par ${activeTab === 'region' ? 'région' : activeTab === 'sector' ? 'secteur' : 'profil'}...`}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={{
            width: '100%',
            height: '42px',
            paddingLeft: '38px',
            paddingRight: '14px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            background: '#F8FAFC',
            fontSize: '0.86rem',
            outline: 'none',
            boxSizing: 'border-box',
            color: '#0F172A'
          }}
        />
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Breakdown Data Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((item, idx) => {
          const count = item.count || 0;
          const pct = Math.round((count / totalCount) * 100);
          const barWidth = Math.round((count / maxCount) * 100);
          const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];

          return (
            <div key={`${item.label}-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                    {item.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>
                    {pct}%
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color, minWidth: '32px', textAlign: 'right' }}>
                    {count}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
                    borderRadius: '99px',
                    transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* État vide — données absentes de l'API, message explicite (Règle 7 + 8) */}
        {rawData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8', fontSize: '0.88rem' }}>
            Aucune donnée disponible pour cet onglet.
          </div>
        )}

        {rawData.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.88rem' }}>
            Aucun résultat correspondant à votre filtre.
          </div>
        )}
      </div>
    </div>
  );
};
