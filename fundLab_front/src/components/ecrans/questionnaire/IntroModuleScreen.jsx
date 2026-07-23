import React, { useState, useEffect } from 'react';
import { 
  Clock, FileText, BarChart2, Lightbulb
} from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

import iconFinanceStrategy from '../../../assets/icone diagnostique/Icon_strategy,-strategics,-finance-strategy,-chess,-horse.png';
import iconFlashCustom from '../../../assets/icone diagnostique/flash.png';
import iconProjectCustom from '../../../assets/icone diagnostique/PROJET.png';
import iconDifficultyCustom from '../../../assets/icone diagnostique/difficulté.png';
import iconOpportunityCustom from '../../../assets/icone diagnostique/OPPORTUNITé.png';
import iconProductCustom from '../../../assets/icone diagnostique/OFFRE PRODUIT.png';
import iconCommercialCustom from '../../../assets/icone diagnostique/COMMERCIAL.png';
import iconGovernanceCustom from '../../../assets/icone diagnostique/organisation.png';
import icon360Custom from '../../../assets/icone diagnostique/360.png';

const MODULE_STYLE_MAP = {
  'PRJ-02': iconProjectCustom,
  'FLH-01': iconFlashCustom,
  'DIF-03': iconDifficultyCustom,
  'OPP-04': iconOpportunityCustom,
  'PRO-05': iconProductCustom,
  'COM-06': iconCommercialCustom,
  'FIN-07': iconFinanceStrategy,
  'GOV-08': iconGovernanceCustom,
  '360-09': icon360Custom,
};

export const IntroModuleScreen = ({ moduleId, moduleData, onStart, onCatalog, onBack }) => {
  const [backendModule, setBackendModule] = useState(null);
  const activeIcon = MODULE_STYLE_MAP[moduleId] || icon360Custom;

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
        .catch(() => { });
    });
  }, [moduleId, moduleData]);

  const title = backendModule?.name || moduleData?.name || moduleId || '';
  const duration = backendModule?.duration || moduleData?.duration || '';
  const qCount = backendModule?.question_count || moduleData?.question_count || null;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="intro-wrap animate-fade-up">
        {/* Animated custom PNG icon inside a premium card wrapper */}
        <div className="intro-module-card">
          <img src={activeIcon} alt={title} className="intro-module-icon" />
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
