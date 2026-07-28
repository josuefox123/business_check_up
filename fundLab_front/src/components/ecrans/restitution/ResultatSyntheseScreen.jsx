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
  // Rule 9: Normalisation des données et préparation de l'état dérivé au sommet du composant
  const scoring = restitution?.scoring || {};
  const restData = restitution?.restitution || restitution || {};

  const scoreRaw = scoring?.converted_score_0_100 ?? restitution?.score;
  const parsedScore = typeof scoreRaw === 'number' ? scoreRaw : Number(scoreRaw || 0);
  const score = Math.max(0, Math.min(100, Math.round(parsedScore)));

  const lvl = getLevel(score);

  const pointsAppui = normalizeToArray(restData?.typical_strengths || restData?.strengths || scoring?.dominant_strength);
  const fragilitiesList = normalizeToArray(restData?.typical_fragilities || restData?.weaknesses || scoring?.dominant_weakness);
  const prioritiesList = normalizeToArray(restData?.priorities || scoring?.priorities);

  const credScoreRaw = scoring?.credibility_score;
  const credScore = (credScoreRaw !== null && credScoreRaw !== undefined && credScoreRaw !== '')
    ? (typeof credScoreRaw === 'number' ? `${Math.round(credScoreRaw <= 1 ? credScoreRaw * 100 : credScoreRaw)}%` : String(credScoreRaw))
    : null;

  const redFlagCount = scoring?.red_flag_count;
  const isCritical = Boolean(scoring?.has_critical_red_flag) || score < 40;

  const displayModuleName = restitution?.module_name ? `RÉSULTAT DIAGNOSTIC — ${restitution.module_name.toUpperCase()}` : 'RÉSULTAT DIAGNOSTIC';
  const bandLabelText = scoring?.band_label ?? "[scoring.band_label non disponible]";

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
  const nextModuleCode = restData?.next_module;
  const nextModuleName = moduleLabels[nextModuleCode] || nextModuleCode || '[next_module non disponible]';

  const hasPointsAppui = pointsAppui.length > 0;
  const hasFragilities = fragilitiesList.length > 0;
  const hasOrientationText = hasContent(restData?.orientation_text);
  const hasDisclaimers = Boolean(restitution?.disclaimer || restitution?.disclaimer_financing);

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
            {displayModuleName}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="res-main-headline">
          Votre <strong>performance</strong> actuelle
        </h1>

        {/* Urgent Attention Alert Banner if present */}
        {restData?.urgent_attention && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#991B1B' }}>
            <AlertOctagon size={24} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '2px' }}>ATTENTION URGENTE</strong>
              <span style={{ fontSize: '0.88rem' }}>{restData.urgent_attention}</span>
            </div>
          </div>
        )}

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

            {credScore && (
              <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#64748B' }}>
                Indice de crédibilité : <strong>{credScore}</strong>
              </div>
            )}
            {redFlagCount !== undefined && redFlagCount !== null && redFlagCount !== '' && (
              <div style={{ marginTop: '4px', fontSize: '0.8rem', color: Number(redFlagCount) > 0 ? '#DC2626' : '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} />
                <span>{Number(redFlagCount) > 0 ? `${redFlagCount} alerte(s) de vigilance` : 'Aucune alerte majeure'}</span>
              </div>
            )}

            <div style={{ marginTop: '12px' }}>
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
              {bandLabelText}
            </div>

            <p className="res-card-paragraph">
              {restData?.summary && (
                <span style={{ display: 'block', marginBottom: '10px' }}>
                  {restData.summary}
                </span>
              )}
              {restData?.interpretation_text && (
                <span style={{ display: 'block', color: '#475569', fontStyle: 'italic' }}>
                  {restData.interpretation_text}
                </span>
              )}
              {!restData?.summary && !restData?.interpretation_text && "[summary / interpretation_text non disponible]"}
            </p>
          </div>
        </div>

        {/* Row 2: Points d'appui Card */}
        {hasPointsAppui && (
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

            {pointsAppui.map((item, idx) => {
              const parsed = parseItem(item);
              return (
                <div key={idx} className="res-appui-inner">
                  <div className="res-appui-title">
                    {parsed.title || '[typical_strengths.title non disponible]'}
                  </div>
                  <div className="res-appui-desc">
                    {parsed.desc || ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Row 3: Priorités d'Action (Dark Card) */}
        <div className="res-dark-card">
          <div className="res-dark-header">
            <span className="res-dark-tag">PRIORITÉS D'ACTION</span>
          </div>

          <div className="res-dark-items-list">
            {(prioritiesList.length > 0 ? prioritiesList : ['[priorities non disponible]']).map((item, idx) => {
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

        {/* Row 4: Fragilités Typiques Stack */}
        {hasFragilities && (
          <div>
            <span className="res-section-title-label">FRAGILITÉS</span>
            <div className="res-item-cards-stack">
              {fragilitiesList.map((item, idx) => {
                const parsed = parseItem(item);
                return (
                  <div key={idx} className="res-item-card">
                    <div
                      className="res-item-icon-badge"
                      style={{ background: '#FEF2F2', color: '#EF4444' }}
                    >
                      <AlertCircle size={16} />
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

        {/* Row 5: Orientation Recommandée & Prochain Diagnostic */}
        <div className="res-reco-row">
          {hasOrientationText && (
            <div className="res-reco-box">
              <span className="res-reco-label">ORIENTATION RECOMMANDEE</span>
              <div className="res-reco-value">
                {restData.orientation_text}
              </div>
              {restData?.follow_up_recommended && (
                <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                  Suivi recommandé : {restData.follow_up_recommended}
                </div>
              )}
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
                {nextModuleName}
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
        {hasDisclaimers && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            {restitution?.disclaimer && (
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: '1.5', margin: '0 0 6px 0' }}>
                {restitution.disclaimer}
              </p>
            )}
            {restitution?.disclaimer_financing && (
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic', margin: 0 }}>
                {restitution.disclaimer_financing}
              </p>
            )}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};
