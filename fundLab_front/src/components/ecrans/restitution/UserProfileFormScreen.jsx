import React, { useState } from 'react';
import { QuestionScreen } from '../questionnaire/QuestionScreen.jsx';
import { REGIONS, SECTORS } from '../../../constants/locationData.js';

const EMPLOYEE_RANGES = [
  { id: '1-10', label: '1 à 10 employés' },
  { id: '11-50', label: '11 à 50 employés' },
  { id: '51-100', label: '51 à 100 employés' },
  { id: '101-250', label: '101 à 250 employés' },
  { id: '251-500', label: '251 à 500 employés' },
  { id: '501+', label: 'Plus de 500 employés (501+)' }
];

export const UserProfileFormScreen = ({ onSubmit, onSkip, onBack, triageAnswers, mode = 'final', onExistingDiagnostic }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const [answers, setAnswers] = useState({
    business_name: triageAnswers?.business_name || '',
    sector: triageAnswers?.sector || triageAnswers?.secteur || '',
    other_sector: '',
    region: triageAnswers?.region || '',
    employee_count_range: triageAnswers?.employee_count_range || '',
    year_created: triageAnswers?.year_created ? String(triageAnswers.year_created) : '',
    activity_description: triageAnswers?.description || triageAnswers?.activity_description || '',
    full_name: triageAnswers?.full_name || triageAnswers?.name || '',
    email: triageAnswers?.email || '',
    phone_suffix: triageAnswers?.phone_number || triageAnswers?.phone || '',
  });

  // Strictement les champs obligatoires du formulaire initial
  const getQuestionsSequence = () => {
    const list = [
      {
        id: 'full_name',
        question: "Quels sont vos nom et prénom ?",
        hint: "Identité du dirigeant ou du représentant qui renseigne le diagnostic.",
        type: 'short_text',
        placeholder: 'ex: Marc DUPONT',
        isOptional: false
      },
      {
        id: 'business_name',
        question: "Quel est le nom de votre entreprise ou projet ?",
        hint: "Information obligatoire pour votre PME.",
        type: 'short_text',
        placeholder: 'ex: Phenix Agro-Industries',
        isOptional: false
      },
      {
        id: 'email',
        question: "Quelle est votre adresse e-mail ?",
        hint: "Adresse obligatoire pour l'envoi de votre rapport.",
        type: 'short_text',
        placeholder: 'ex: dirigeant@entreprise.com',
        isOptional: false
      },
      {
        id: 'phone_suffix',
        question: "Quel est votre numéro de téléphone ?",
        hint: "Numéro obligatoire de contact.",
        type: 'short_text',
        placeholder: 'ex: 0197000000',
        isOptional: false
      },
      {
        id: 'region',
        question: "Quel est votre département / région ?",
        hint: "Localisation obligatoire de votre PME.",
        type: 'choice',
        choices: REGIONS.map(r => ({ id: r, label: r })),
        isOptional: false
      },
      {
        id: 'sector',
        question: "Dans quel secteur d'activité évolue votre PME ?",
        hint: "Secteur d'activité obligatoire.",
        type: 'choice',
        choices: SECTORS.map((s, idx) => ({ id: typeof s === 'string' ? s : (s.id || s.name || `sec-${idx}`), label: typeof s === 'string' ? s : s.name })),
        isOptional: false
      }
    ];

    if (answers.sector === 'Autre') {
      list.push({
        id: 'other_sector',
        question: "Veuillez préciser votre secteur d'activité :",
        hint: "Information obligatoire en cas de choix 'Autre'.",
        type: 'short_text',
        placeholder: 'ex: Énergies renouvelables...',
        isOptional: false
      });
    }

    list.push(
      {
        id: 'year_created',
        question: "En quelle année votre entreprise a-t-elle été créée ?",
        hint: "Année de création obligatoire.",
        type: 'short_text',
        placeholder: 'ex: 2020',
        isOptional: false
      },
      {
        id: 'activity_description',
        question: "Décrivez en quelques mots, votre activité ?",
        hint: "Description obligatoire de vos activités.",
        type: 'short_text',
        placeholder: 'ex: Production et transformation de jus de fruits locaux...',
        isOptional: false
      },
      {
        id: 'employee_count_range',
        question: "Quelle est votre tranche d'effectifs (nombre d'employés) ?",
        hint: "Sélectionnez l'option correspondant à la taille de votre équipe.",
        type: 'choice',
        choices: EMPLOYEE_RANGES.map(r => ({ id: r.id, label: r.label })),
        isOptional: true
      }
    );

    return list;
  };

  const questionsList = getQuestionsSequence();
  const currentQ = questionsList[stepIndex] || questionsList[0];

  const handleNextStep = async (val) => {
    const finalVal = val !== null && val !== undefined ? val : (answers[currentQ.id] || '');
    const updated = {
      ...answers,
      [currentQ.id]: finalVal
    };

    if (currentQ.id === 'sector' && finalVal !== 'Autre') {
      updated.other_sector = '';
    }

    setAnswers(updated);

    if (stepIndex + 1 < questionsList.length) {
      setStepIndex(stepIndex + 1);
    } else {
      const finalSector = updated.sector === 'Autre' && updated.other_sector ? updated.other_sector : updated.sector;

      const payload = {
        ...updated,
        sector: finalSector,
        phone_number: updated.phone_suffix,
        phone: updated.phone_suffix
      };

      if (onSubmit) {
        await onSubmit(payload);
      }
    }
  };

  const handleSkipStep = async () => {
    if (stepIndex + 1 < questionsList.length) {
      setStepIndex(stepIndex + 1);
    } else {
      const finalSector = answers.sector === 'Autre' && answers.other_sector ? answers.other_sector : answers.sector;

      const payload = {
        ...answers,
        sector: finalSector,
        phone_number: answers.phone_suffix,
        phone: answers.phone_suffix
      };

      if (onSubmit) {
        await onSubmit(payload);
      }
    }
  };

  const handleStepBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <QuestionScreen
      key={currentQ.id}
      moduleId="PROFIL"
      questionData={currentQ}
      current={stepIndex + 1}
      total={questionsList.length}
      savedAnswer={answers[currentQ.id] || null}
      onContinue={handleNextStep}
      onSkip={currentQ.isOptional ? handleSkipStep : null}
      onBack={handleStepBack}
      onQuit={onBack}
    />
  );
};
