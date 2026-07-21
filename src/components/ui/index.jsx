import React from 'react';
import { Check } from 'lucide-react';
import '../ui/ui.css';

/* ================== BUTTON ================== */
export const Button = ({ children, variant = 'primary', size = '', full = false, onClick, disabled = false, type = 'button', className = '', style }) => {
  const classes = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', full ? 'btn-full' : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
};

/* ================== CHOICE CARD ================== */
export const ChoiceCard = ({ label, icon, selected, onClick }) => (
  <button type="button" className={`choice-card ${selected ? 'selected' : ''}`} onClick={onClick}>
    {icon && <div className="choice-card-icon">{icon}</div>}
    <span className="choice-card-label">{label}</span>
    <div className="choice-card-check">
      {selected && <Check size={14} color="white" strokeWidth={3} />}
    </div>
  </button>
);

/* ================== CHECKBOX CARD ================== */
export const CheckboxCard = ({ label, checked, onChange }) => {
  const classes = ['checkbox-card', checked ? 'checked' : ''].filter(Boolean).join(' ');
  return (
    <button type="button" className={classes} onClick={onChange}>
      <div className="checkbox-visual">
        {checked && <Check size={14} color="white" strokeWidth={3} />}
      </div>
      <span className="checkbox-label">{label}</span>
    </button>
  );
};

/* ================== PROGRESS BAR ================== */
export const ProgressBar = ({ current, total, label }) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span className="progress-label">{label || `Question ${current}/${total}`}</span>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ================== SCORE GAUGE ================== */
const SCORE_LEVEL = (score) => {
  if (score < 20) return { label: 'Critique',  color: '#DC2626' };
  if (score < 40) return { label: 'Fragile',   color: '#F59E0B' };
  if (score < 60) return { label: 'Stable',    color: '#3B82F6' };
  if (score < 80) return { label: 'Solide',    color: '#10B981' };
  return              { label: 'Avancé',   color: '#059669' };
};

export const ScoreGauge = ({ score, size = 180 }) => {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-gauge-wrap" style={{ width: size, height: size, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg className="score-gauge-svg" width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx="50" cy="50" r={r} 
          fill="none" 
          stroke="#E2E8F0" 
          strokeWidth="8" 
        />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="#17212D" 
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <div className="score-gauge-inner" style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span className="score-number" style={{ fontSize: '2.4rem', fontWeight: 900, color: '#17212D', lineHeight: 1 }}>{score}</span>
        <span className="score-max" style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>/ 100</span>
        <span className="score-label-sub" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8892AA', fontWeight: 700, marginTop: '2px' }}>Score global</span>
      </div>
    </div>
  );
};

/* ================== BADGE ================== */
export const Badge = ({ children, variant = 'blue', className = '' }) => (
  <span className={`badge badge-${variant} ${className}`}>{children}</span>
);
