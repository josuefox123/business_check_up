import React from 'react';
import { ArrowRight } from 'lucide-react';
import hiwOrientationImg from '../../../assets/hiw_orientation.jpg';
import hiwDiagnosticImg from '../../../assets/hiw_diagnostic.jpg';
import hiwRestitutionImg from '../../../assets/hiw_restitution.jpg';
import './CommentCaMarche.css';

export const CommentCaMarche = ({ onStart }) => {
  const steps = [
    {
      num: '01',
      title: 'Profil & Orientation',
      desc: 'Quelques questions simples pour cerner votre contexte et cibler immédiatement l\'évaluation la plus pertinente.',
      image: hiwOrientationImg,
      imageAlt: 'Orientation et choix du profil',
    },
    {
      num: '02',
      title: 'Évaluation ciblée',
      desc: 'Un questionnaire déclaratif sans justificatifs comptables, pensé pour aller droit au but à votre rythme.',
      image: hiwDiagnosticImg,
      imageAlt: 'Questionnaire d\'évaluation',
    },
    {
      num: '03',
      title: 'Restitution & Plan d\'action',
      desc: 'Votre score global de viabilité, vos points de vigilance et vos priorités concrètes, téléchargeables immédiatement en PDF.',
      image: hiwRestitutionImg,
      imageAlt: 'Scorecard et plan d\'action',
    },
  ];

  return (
    <div className="hiw-page">
      {/* ── EN-TÊTE ÉPURÉ ── */}
      <section className="hiw-hero">
        <div className="hiw-container">
          <span className="hiw-tag">Méthodologie</span>
          <h1 className="hiw-title">
            Comment ça <span className="hiw-title-accent">marche.</span>
          </h1>
          <p className="hiw-subtitle">
            3 étapes simples pour évaluer la santé de votre entreprise et obtenir votre feuille de route.
          </p>
        </div>
      </section>

      {/* ── LES 3 ÉTAPES CLAIRES ── */}
      <section className="hiw-steps-section">
        <div className="hiw-container">
          <div className="hiw-steps-grid">
            {steps.map((step, idx) => (
              <div key={step.num} className={`hiw-step-item ${idx % 2 === 1 ? 'reverse' : ''}`}>
                <div className="hiw-step-info">
                  <span className="hiw-step-number">{step.num}</span>
                  <h2 className="hiw-step-heading">{step.title}</h2>
                  <p className="hiw-step-text">{step.desc}</p>
                </div>

                {/* <div className="hiw-step-mockup">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="hiw-mockup-img"
                    loading="lazy"
                  />
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL SOBRE ── */}
      <section className="hiw-cta">
        <div className="hiw-container hiw-cta-inner">
          <h2 className="hiw-cta-heading">Prêt à faire le point ?</h2>
          <p className="hiw-cta-text">
            L'évaluation est gratuite, sans engagement et sans inscription obligatoire.
          </p>
          <button type="button" className="hiw-cta-button" onClick={onStart}>
            Commencer mon diagnostic
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};
