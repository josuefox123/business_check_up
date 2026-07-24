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
    <ScreenWrapper className="intro-screen-wrapper">
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="intro-wrap animate-fade-up">
        {/* Animated custom PNG icon inside a premium card wrapper */}
        <div className="intro-module-card-wrapper">
          <div className="intro-module-card">
            <img src={activeIcon} alt={title} className="intro-module-icon" />
          </div>
        </div>

        <h1 className="screen-title">{title}</h1>

        {/* Hero duration element for mobile only, shown prominently like in the screenshot */}
        {duration && (
          <div className="intro-hero-duration">
            <div className="duration-value-row">
              <span className="duration-value">{duration.replace(' min', '').replace(' MIN', '')}</span>
              <span className="duration-unit">MIN</span>
            </div>
            <span className="duration-label">Durée estimée</span>
          </div>
        )}

        <div className="intro-meta-row">
          {duration && (
            <span className="intro-meta-chip duration-chip">
              <Clock size={14} className="meta-icon" />
              {duration}
            </span>
          )}
          {qCount && (
            <span className="intro-meta-chip">
              <FileText size={14} className="meta-icon" />
              {qCount} questions
            </span>
          )}
          <span className="intro-meta-chip">
            <BarChart2 size={14} className="meta-icon" />
            Score + Forces + Fragilités + Priorités
          </span>
        </div>

        <div className="alert alert-info">
          <Lightbulb size={18} className="alert-icon" />
          <span>Répondez le plus simplement possible.</span>
        </div>

        <div className="intro-actions">
          <Button variant="primary" size="lg" full onClick={onStart}>Commencer le diagnostic →</Button>
          <Button variant="outline" onClick={onCatalog}>Voir les autres diagnostics</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
