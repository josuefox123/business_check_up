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
  Zap,
  Info,
  AlertOctagon,
  Wrench,
  UserCheck,
  EyeOff,
  FileMinus,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import './ResultatSynthese.css';

export const getLevel = (s) => {
  if (s < 20) return { label: 'Point de vigilance prioritaire', color: '#DC2626' };
  if (s < 40) return { label: 'Point de vigilance prioritaire', color: '#DC2626' };
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
      } catch (e) { }
    }
    return value
      .split(/[\n;|]+/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

const hasContent = (value) => typeof value === 'string' && value.trim().length > 0;

const parseItem = (text) => {
  if (!text) return { title: '', desc: null };
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
  const scoreRaw = restitution?.scoring?.converted_score_0_100 ?? localScore;
  const score = typeof scoreRaw === 'number' ? scoreRaw : Number(scoreRaw || 0);

  const lvl = getLevel(score);

  const pointsAppui = normalizeToArray(restitution?.typical_strengths);
  const strengthsList = normalizeToArray(restitution?.strengths);
  const weaknessesList = normalizeToArray(restitution?.weaknesses);
  const fragilitiesList = normalizeToArray(restitution?.typical_fragilities);
  const prioritiesList = normalizeToArray(restitution?.priorities);

  const credScore = (() => {
    const cs = restitution?.scoring?.credibility_score ?? restitution?.scoring?.credibiliy_score;
    if (cs === null || cs === undefined) return '0%';
    const num = Number(cs);
    if (isNaN(num)) return String(cs);
    return `${Math.round(num * 100)}%`;
  })();

  const isCritical = restitution?.scoring?.critical_red_flag_present || score < 40;

  // SVG Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <ScreenWrapper wide>
      {onBack && <TopBackLink onClick={onBack} />}

      <div className="res-dashboard-container animate-fade-up">
        {/* Top Pill Badge */}
        <div className="res-pill-badge-wrap">
          <span className="res-pill-badge">
            RÉSULTAT DIAGNOSTIC
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="res-main-headline">
          Votre <strong>performance</strong> actuelle
        </h1>

        {/* Top Hero Block: Score (Left) + Résumé Diagnostic (Right on PC) */}
        <div className="res-pc-top-hero">
          {/* Left: Score Gauge Card */}
          <div className="res-score-card">
            <div className="res-score-gauge-wrap">
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ overflow: 'visible' }}>
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(0, 0, 0, 0.04)"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={lvl.color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div className="res-score-inner-content">
                <div className="res-score-number">{score}</div>
                <div className="res-score-denom">/100</div>
              </div>
            </div>

            <div className="res-score-meta">
              Crédibilité <strong>{credScore}</strong>
            </div>

            <div>
              <span
                className="res-critical-pill"
                style={{
                  background: isCritical ? '#FEF2F2' : '#ECFDF5',
                  color: isCritical ? '#DC2626' : '#059669',
                  border: isCritical ? '1px solid #FEE2E2' : '1px solid #A7F3D0'
                }}
              >
                <AlertTriangle size={14} />
                <span>{isCritical ? 'RÉSULTAT CRITIQUE' : 'RÉSULTAT SATISFAISANT'}</span>
              </span>
            </div>
          </div>

          {/* Right: Résumé Diagnostic Card */}
          <div className="res-white-card res-hero-summary-card">
            <div className="res-card-header">
              <div className="res-card-header-left">
                <div className="res-card-icon-badge">
                  <Info size={18} />
                </div>
                <h2 className="res-card-title">Résumé Diagnostic</h2>
              </div>
            </div>

            <div className="res-level-highlight-sub" style={{ color: isCritical ? '#DC2626' : '#10B981' }}>
              {restitution?.scoring?.band_label || lvl.label}
            </div>

            <p className="res-card-paragraph">
              {restitution?.interpretation_text || restitution?.summary ||
                "Non reçu"}
            </p>
          </div>
        </div>

        {/* Row 2: Points d'appui Card */}
        {(pointsAppui.length > 0 || strengthsList.length > 0) && (
          <div className="res-white-card">
            <div className="res-card-header">
              <span className="res-section-tag">POINTS D'APPUI</span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#CCFBF1',
                  color: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle size={16} />
              </div>
            </div>

            {(pointsAppui.length > 0 ? pointsAppui : strengthsList).map((item, idx) => {
              const parsed = parseItem(item);
              return (
                <div key={idx} className="res-appui-inner">
                  <div className="res-appui-title">
                    {parsed.title || 'Pas de titre'}
                  </div>
                  <div className="res-appui-desc">
                    {parsed.desc || ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Row 3: Priorités d'Action (Dark Card — 3 Columns on PC) */}
        <div className="res-dark-card">
          <div className="res-dark-header">
            <span className="res-dark-tag">PRIORITÉS D'ACTION</span>
          </div>

          <div className="res-dark-items-list">
            {(prioritiesList.length > 0 ? prioritiesList : [
              'Identifier le problème exact',
              'Produire un élément concret',
              'Demander un appui personnalisé'
            ]).map((item, idx) => {
              const parsed = parseItem(item);
              return (
                <div key={idx} className="res-dark-item-row">
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(52, 190, 213, 0.2)',
                      border: '1px solid rgba(52, 190, 213, 0.4)',
                      color: '#34BED5',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span className="res-dark-item-text">{parsed.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 4: Fragilités Typiques Stack (3 Columns on PC) */}
        {(fragilitiesList.length > 0 || weaknessesList.length > 0) && (
          <div>
            <span className="res-section-title-label">FRAGILITÉS</span>
            <div className="res-item-cards-stack">
              {(fragilitiesList.length > 0 ? fragilitiesList : weaknessesList).map((item, idx) => {
                const parsed = parseItem(item);
                const icons = [<EyeOff size={16} key={1} />, <FileMinus size={16} key={2} />, <AlertCircle size={16} key={3} />];
                return (
                  <div key={idx} className="res-item-card">
                    <div
                      className="res-item-icon-badge"
                      style={{ background: '#FEF2F2', color: '#EF4444' }}
                    >
                      {icons[idx % icons.length]}
                    </div>
                    <div className="res-item-content">
                      <h4 className="res-item-title">{parsed.title}</h4>
                      {parsed.desc && <p className="res-item-desc">{parsed.desc}</p>}
                    </div>
                    <ChevronRight size={16} style={{ color: '#CBD5E1', flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 5: Orientation Recommandée & Prochain Diagnostic (2 Columns on PC) */}
        <div className="res-reco-row">
          {hasContent(restitution?.orientation_text) && (
            <div className="res-reco-box">
              <span className="res-reco-label">ORIENTATION RECOMMANDEE</span>
              <div className="res-reco-value">
                {restitution.orientation_text}
              </div>
            </div>
          )}

          <div className="res-reco-box">
            <span className="res-reco-label">PROCHAIN DIAGNOSTIC CONSEILLÉ</span>
            <div
              className="res-reco-value"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={16} style={{ color: '#10B981' }} />
              <span>
                {(() => {
                  const moduleLabels = {
                    'PRJ-02': 'Diagnostic Projet',
                    'FLH-01': 'Diagnostic Flash',
                    'DIF-03': 'Diagnostic Difficulté',
                    'OPP-04': 'Diagnostic Opportunité',
                    'PRO-05': 'Diagnostic Offre/Produits',
                    'COM-06': 'Diagnostic Commercial',
                    'FIN-07': 'Diagnostic Finance',
                    'GOV-08': 'Diagnostic Organisation',
                    '360-09': 'Diagnostic Complet 360°',
                  };
                  const code = restitution?.next_module;
                  return moduleLabels[code] || code || 'Non défini';
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons — ALWAYS AT THE VERY BOTTOM */}
        <div className="res-actions-group">
          <Button
            type="button"
            variant="primary"
            full
            size="lg"
            onClick={onEnrichment || onDetail}
            className="res-btn-primary"
          >
            <FileText size={18} />
            <span>Voir mon rapport complet</span>
          </Button>

          {onRestart && (
            <Button
              type="button"
              variant="outline"
              full
              onClick={onRestart}
              className="res-btn-secondary"
            >
              Faire un autre diagnostic
            </Button>
          )}
        </div>

        {/* Disclaimers if present */}
        {(restitution?.disclaimer || restitution?.disclaimer_financing) && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            {restitution?.disclaimer && (
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: '1.5', margin: 0 }}>
                {restitution.disclaimer}
              </p>
            )}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};
