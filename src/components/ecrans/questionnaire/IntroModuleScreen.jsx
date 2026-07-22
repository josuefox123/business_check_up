import React, { useState, useEffect } from 'react';
import { 
  Rocket, Zap, AlertTriangle, Target, Lightbulb, Users, TrendingUp, Building2, Award,
  Clock, FileText, BarChart2, HelpCircle
} from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

const MODULE_ICONS_MAP = {
  Rocket,
  Zap,
  AlertTriangle,
  Target,
  Lightbulb,
  Users,
  TrendingUp,
  Building2,
  Award
};

const MODULE_INTRO_STYLES = {
  'PRJ-02': { iconName: 'Rocket', bg: '#EFF6FF', iconColor: '#2659F2' },
  'FLH-01': { iconName: 'Zap', bg: '#ECFDF5', iconColor: '#059669' },
  'DIF-03': { iconName: 'AlertTriangle', bg: '#FEF2F2', iconColor: '#ef4444' },
  'OPP-04': { iconName: 'Target', bg: '#FFFBEB', iconColor: '#f59e0b' },
  'PRO-05': { iconName: 'Lightbulb', bg: '#F0FDF4', iconColor: '#10b981' },
  'COM-06': { iconName: 'Users', bg: '#FFF7ED', iconColor: '#f97316' },
  'FIN-07': { iconName: 'TrendingUp', bg: '#EFF6FF', iconColor: '#2563eb' },
  'GOV-08': { iconName: 'Building2', bg: '#FAF5FF', iconColor: '#8b5cf6' },
  '360-09': { iconName: 'Award', bg: '#F0FDF4', iconColor: '#16a34a' },
};

export const IntroModuleScreen = ({ moduleId, moduleData, onStart, onCatalog, onBack }) => {
  const [backendModule, setBackendModule] = useState(null);
  const style = MODULE_INTRO_STYLES[moduleId] || MODULE_INTRO_STYLES['FLH-01'];
  const IconComp = MODULE_ICONS_MAP[style.iconName] || HelpCircle;

  useEffect(() => {
    if (moduleData?.name && moduleData?.question_count) {
      setBackendModule(moduleData);
      return;
    }
    if (!moduleId) return;
    import('../../../api/config.js').then(({ apiFetch }) => {
      apiFetch(`/modules/${moduleId}`)
        .then(res => {
          const d = res?.data || res;
          if (d?.code) {
            setBackendModule({
              id: d.code,
              name: d.name,
              duration: d.target_duration_formatted || d.target_duration || '',
              description: d.description || '',
              question_count: d.question_count || null
            });
          }
        })
        .catch(() => {
          import('../../../repositories/LocalStoreRepository.js').then(({ LocalStoreRepository }) => {
            const qData = LocalStoreRepository.getQuestionnaires();
            const localModule = qData.catalog[moduleId];
            if (localModule) {
              setBackendModule({
                id: moduleId,
                name: localModule.name,
                duration: localModule.estimatedTime || localModule.duration || '',
                description: localModule.description || '',
                question_count: qData.modules[moduleId]?.questions?.length || null
              });
            }
          });
        });
    });
  }, [moduleId, moduleData]);

  const title = backendModule?.name || moduleData?.name || moduleId || '';
  const duration = backendModule?.duration || moduleData?.duration || '';
  const qCount = backendModule?.question_count || moduleData?.question_count || null;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="intro-wrap animate-fade-up">
        <div className="screen-icon-header" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="screen-icon" style={{ background: style.bg, color: style.iconColor, width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComp size={32} />
          </div>
        </div>
        <h1 className="screen-title" style={{ textAlign: 'center' }}>{title}</h1>

        <div className="intro-meta-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {duration && (
            <span className="intro-meta-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} style={{ color: 'var(--slate-500)' }} />
              {duration}
            </span>
          )}
          {qCount && (
            <span className="intro-meta-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} style={{ color: 'var(--slate-500)' }} />
              {qCount} questions
            </span>
          )}
          <span className="intro-meta-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={14} style={{ color: 'var(--slate-500)' }} />
            Score + Forces + Fragilités + Priorités
          </span>
        </div>

        <div className="alert alert-info" style={{ margin: 'var(--space-6) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} className="text-blue" />
          <span>Répondez le plus simplement possible. Si vous ne connaissez pas une information, choisissez "Je ne sais pas".</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Button variant="primary" size="lg" full onClick={onStart}>Commencer le diagnostic →</Button>
          <Button variant="outline" onClick={onCatalog}>Voir les autres diagnostics</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
