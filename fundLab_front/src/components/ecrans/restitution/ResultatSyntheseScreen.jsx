import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Target,
  Calendar,
  Download,
  ChevronRight,
  BarChart2,
  Flag,
  FileText,
  Share2,
  Menu,
  Loader2
} from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { generateDiagnosticPDF } from '../../../utils/generateDiagnosticPDF.js';

export const getLevel = (s) => {
  if (s < 20) return { label: 'Critique', color: '#EF4444' };
  if (s < 40) return { label: 'Fragile', color: '#F59E0B' };
  if (s < 60) return { label: 'Stable', color: '#10B981' };
  if (s < 80) return { label: 'Solide', color: '#059669' };
  return { label: 'Avancé', color: '#3B82F6' };
};

export const normalizeToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  
  if (typeof value === 'string') {
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (e) {}
    }
    return value
      .split(/[\n;|]+/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

// Returns true only if value is a non-empty, non-whitespace string
const hasContent = (value) => typeof value === 'string' && value.trim().length > 0;

const parseItem = (text) => {
  const parts = text.split(':');
  if (parts.length > 1) {
    return {
      title: parts[0].trim(),
      desc: parts.slice(1).join(':').trim()
    };
  }
  return {
    title: text,
    desc: null
  };
};

export const ResultatSyntheseScreen = ({
  score: localScore,
  answers,
  moduleId,
  onDetail,
  onContact,
  onRestart,
  onBack,
  restitution,
  onCatalog,
  onEnrichment
}) => {
  // Use scoring.converted_score_0_100 or fallback to localScore prop
  const scoreRaw = restitution?.scoring?.converted_score_0_100 ?? localScore;
  const score = typeof scoreRaw === 'number' ? scoreRaw : Number(scoreRaw || 0);

  const lvl = getLevel(score);

  const cleanModuleName = restitution?.module_name || moduleId;

  // ── Normalize list fields (noms exacts du backend) ──
  const pointsAppui       = normalizeToArray(restitution?.typical_strengths);
  const strengthsList     = normalizeToArray(restitution?.strengths);
  const weaknessesList    = normalizeToArray(restitution?.weaknesses);
  const fragilitiesList   = normalizeToArray(restitution?.typical_fragilities);
  const prioritiesList    = normalizeToArray(restitution?.priorities);

  const credScore = (() => {
    const cs = restitution?.scoring?.credibility_score ?? restitution?.scoring?.credibiliy_score;
    if (cs === null || cs === undefined) return '—';
    const num = Number(cs);
    if (isNaN(num)) return String(cs);
    // Backend sends decimal (0–1), convert to percentage
    return `${Math.round(num * 100)}%`;
  })();

  return (
    <ScreenWrapper wide>
      <div
        className="animate-fade-up"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-4) var(--space-8) var(--space-4)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#070E24',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >

        {/* ── Hero Score Banner (full width) ── */}
        <div
          style={{
            background: '#070E24',
            borderRadius: '24px',
            padding: '32px 36px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 30px rgba(7, 14, 36, 0.14)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', fontWeight: 600, marginBottom: '8px' }}>
              Votre lecture globale
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: '1.5rem', color: '#64748B', fontWeight: 600 }}>/100</span>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>
              <span>
                Crédibilité&nbsp;
                <span style={{ color: '#ffffff', fontWeight: 700 }}>
                  {credScore}
                </span>
              </span>
              <span style={{ color: '#334155' }}>|</span>
              <span>
                Criticité&nbsp;
                <span style={{ color: restitution?.scoring?.critical_red_flag_present ? '#EF4444' : '#ffffff', fontWeight: 700 }}>
                  {restitution?.scoring?.red_flag_count ?? '—'}
                </span>
              </span>
            </div>
          </div>

          {/* Circular progress */}
          <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="44" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="55" cy="55" r="44"
                fill="transparent"
                stroke="#34BED5"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - score / 100)}
                strokeLinecap="round"
                transform="rotate(-90 55 55)"
              />
              <text x="55" y="60" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="800">{score}</text>
            </svg>
          </div>
        </div>

        {/* ── Interprétation badge ── */}
        {restitution?.interpretation_text && (
          <div style={{
            background: restitution?.scoring?.critical_red_flag_present ? '#FEF2F2' : '#FFF7ED',
            color: restitution?.scoring?.critical_red_flag_present ? '#991B1B' : '#C2410C',
            border: restitution?.scoring?.critical_red_flag_present ? '1px solid #FEE2E2' : '1px solid #FFEDD5',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            fontWeight: 500,
          }}>
            <BarChart2 size={20} style={{ color: restitution?.scoring?.critical_red_flag_present ? '#EF4444' : '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
            <span>{restitution.interpretation_text}</span>
          </div>
        )}

        {/* ── Appréciation card ── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>
              Appréciation
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Niveau obtenu :&nbsp;
              <span style={{ color: lvl.color }}>{restitution?.scoring?.band_label || lvl.label}</span>
            </div>
          </div>
          <div style={{ height: '52px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
            <svg width="90" height="52" viewBox="0 0 80 46" style={{ overflow: 'visible' }}>
              <path d="M 10 40 A 30 30 0 0 1 70 40" fill="none" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
              <path d="M 10 40 A 30 30 0 0 1 70 40" fill="none" stroke={lvl.color} strokeWidth="6" strokeLinecap="round" strokeDasharray="94.2" strokeDashoffset={94.2 * (1 - score / 100)} />
              <g transform={`translate(40, 40) rotate(${(score / 100) * 130 - 65})`}>
                <line x1="0" y1="0" x2="0" y2="-28" stroke="#070E24" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="0" cy="0" r="5.5" fill="#070E24" />
              </g>
            </svg>
          </div>
        </div>


        {/* ── Synthèse ── */}
        {hasContent(restitution?.summary) && (
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 600, marginBottom: '14px' }}>
              Synthèse du diagnostic
            </div>
            <div style={{ fontSize: '0.97rem', lineHeight: '1.7', color: '#334155' }} dangerouslySetInnerHTML={{ __html: restitution.summary }} />
          </div>
        )}

        {/* ── Points d'appui ── */}
        {pointsAppui.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={15} style={{ fill: '#137333', stroke: '#E6F4EA' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Points d'appui</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pointsAppui.map((f, i) => {
                const p = parseItem(f);
                return (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ paddingRight: '12px' }}>
                      <h4 style={{ fontSize: '0.97rem', fontWeight: 700, margin: '0 0 3px 0' }}>{p.title}</h4>
                      {p.desc && <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>{p.desc}</p>}
                    </div>
                    <ChevronRight size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Forces ── */}
        {strengthsList.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={15} style={{ fill: '#137333', stroke: '#E6F4EA' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Forces</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {strengthsList.map((f, i) => {
                const p = parseItem(f);
                return (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ paddingRight: '12px' }}>
                      <h4 style={{ fontSize: '0.97rem', fontWeight: 700, margin: '0 0 3px 0' }}>{p.title}</h4>
                      {p.desc && <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>{p.desc}</p>}
                    </div>
                    <ChevronRight size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Faiblesses ── */}
        {weaknessesList.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flag size={13} style={{ fill: '#EF4444', stroke: '#EF4444' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Faiblesses</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {weaknessesList.map((f, i) => {
                const p = parseItem(f);
                return (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '4px solid #EF4444', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ paddingRight: '12px' }}>
                      <h4 style={{ fontSize: '0.97rem', fontWeight: 700, margin: '0 0 3px 0' }}>{p.title}</h4>
                      {p.desc && <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>{p.desc}</p>}
                    </div>
                    <ChevronRight size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Fragilités typiques ── */}
        {fragilitiesList.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={13} style={{ color: '#D97706' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Fragilités typiques</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {fragilitiesList.map((f, i) => {
                const p = parseItem(f);
                return (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ paddingRight: '12px' }}>
                      <h4 style={{ fontSize: '0.97rem', fontWeight: 700, margin: '0 0 3px 0' }}>{p.title}</h4>
                      {p.desc && <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>{p.desc}</p>}
                    </div>
                    <ChevronRight size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Priorité d'action ── */}
        {prioritiesList.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={14} style={{ color: '#D97706' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Priorités d'action</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {prioritiesList.map((f, i) => {
                const p = parseItem(f);
                return (
                  <div key={i} style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ paddingRight: '12px' }}>
                      <h4 style={{ fontSize: '0.97rem', fontWeight: 700, margin: '0 0 3px 0' }}>{p.title}</h4>
                      {p.desc && <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>{p.desc}</p>}
                    </div>
                    <ChevronRight size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Orientation recommandée ── */}
        {hasContent(restitution?.orientation_text) && (
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 600, marginBottom: '14px' }}>
              Orientation recommandée
            </div>
            <div style={{ fontSize: '0.97rem', lineHeight: '1.7', color: '#334155' }}>{restitution.orientation_text}</div>
          </div>
        )}

        {/* ── Prochain diagnostic ── */}
        {hasContent(restitution?.next_module) && (
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 600, marginBottom: '14px' }}>
              Prochain diagnostic conseillé
            </div>
            <div style={{ fontSize: '0.97rem', lineHeight: '1.7', color: '#334155' }}>{restitution.next_module}</div>
          </div>
        )}

        {/* ── Suivi recommandé ── */}
        {hasContent(restitution?.follow_up_recommended) && (
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 600, marginBottom: '14px' }}>
              Suivi recommandé
            </div>
            <div style={{ fontSize: '0.97rem', lineHeight: '1.7', color: '#334155' }}>{restitution.follow_up_recommended}</div>
          </div>
        )}

        {/* ── Enrichment questions row ── */}
        <div
          onClick={onEnrichment}
          style={{
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="action-row-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#070E24" />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Voir mon rapport complet</span>
          </div>
          <ChevronRight size={20} style={{ color: '#94A3B8' }} />
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            onClick={onRestart}
            style={{ flex: '1 1 0%', minWidth: '200px', justifyContent: 'center', borderRadius: '14px', height: '50px', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Faire un autre diagnostic
          </Button>
          <Button
            variant="primary"
            onClick={onCatalog}
            style={{ flex: '1 1 0%', minWidth: '200px', justifyContent: 'center', borderRadius: '14px', height: '50px', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Personnaliser mon rapport
          </Button>
        </div>

        {/* ── Disclaimers ── */}
        {(restitution?.disclaimer || restitution?.disclaimer_financing) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
            {restitution?.disclaimer && (
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                {restitution.disclaimer}
              </p>
            )}
            {restitution?.disclaimer_financing && (
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px 20px', fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                {restitution.disclaimer_financing}
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        .action-row-hover:hover {
          background-color: #F8FAFC !important;
          border-color: #CBD5E1 !important;
        }
      `}</style>
    </ScreenWrapper>
  );
};
