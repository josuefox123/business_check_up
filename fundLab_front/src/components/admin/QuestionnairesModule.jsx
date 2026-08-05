import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, Plus, Edit, Filter, Award, ChevronRight, Layers, HelpCircle, LayoutGrid } from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';

export const QuestionnairesModule = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionSearch, setQuestionSearch] = useState('');

  // Modals state
  const [editQuestion, setEditQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState(false);

  // Form states
  const [qId, setQId] = useState('');
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('single');
  const [qAxe, setQAxe] = useState('');
  const [qWeight, setQWeight] = useState(15);
  const [qChoices, setQChoices] = useState([{ id: 'opt1', label: '', score: 10 }]);

  useEffect(() => {
    AdministrationService.questionnaires.getQuestionnaires().then(setQuestionnaires);
  }, []);

  const handleSelectQuestionnaire = (moduleId) => {
    setSelectedModuleId(moduleId);
    AdministrationService.questionnaires.getQuestionnaireById(moduleId).then(res => {
      setSelectedQuestionnaire(res);
      setQuestions(res?.questions || []);
      setQuestionSearch('');
    });
  };

  const handleEditClick = (q) => {
    setEditQuestion(q);
    setQId(q.id);
    setQText(q.question);
    setQType(q.type);
    setQAxe(q.axe || '');
    setQWeight(q.weight || 0);
    setQChoices(q.choices || [{ id: 'opt1', label: '', score: 10 }]);
    setNewQuestion(false);
  };

  const handleAddClick = () => {
    setEditQuestion(null);
    setQId(`q${questions.length + 1}`);
    setQText('');
    setQType('single');
    setQAxe('');
    setQWeight(15);
    setQChoices([{ id: 'opt1', label: '', score: 15 }]);
    setNewQuestion(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedQuestion = {
      id: qId,
      question: qText,
      type: qType,
      axe: qAxe,
      weight: Number(qWeight),
      choices: qChoices.filter(c => c.label !== '')
    };

    AdministrationService.questions.saveQuestion(selectedModuleId, updatedQuestion).then(() => {
      handleSelectQuestionnaire(selectedModuleId);
      setEditQuestion(null);
      setNewQuestion(false);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette question ?')) {
      AdministrationService.questions.deleteQuestion(selectedModuleId, id).then(() => {
        handleSelectQuestionnaire(selectedModuleId);
      });
    }
  };

  const addChoice = () => {
    setQChoices([...qChoices, { id: `opt${qChoices.length + 1}`, label: '', score: 10 }]);
  };

  const updateChoice = (idx, field, value) => {
    const updated = [...qChoices];
    updated[idx][field] = field === 'score' ? Number(value) : value;
    setQChoices(updated);
  };

  const removeChoice = (idx) => {
    setQChoices(qChoices.filter((_, i) => i !== idx));
  };

  // Filtrer les questions
  const filteredQuestions = questions.filter(q => {
    if (!questionSearch) return true;
    return (q.question && q.question.toLowerCase().includes(questionSearch.toLowerCase())) ||
      (q.id && q.id.toLowerCase().includes(questionSearch.toLowerCase())) ||
      (q.axe && q.axe.toLowerCase().includes(questionSearch.toLowerCase()));
  });

  // Grouper les questions par Axe diagnostique (Dimension)
  const groupedQuestions = filteredQuestions.reduce((acc, q) => {
    const axeName = q.axe || 'Général';
    if (!acc[axeName]) acc[axeName] = [];
    acc[axeName].push(q);
    return acc;
  }, {});

  return (
    <>
      <div className="admin-page animate-fade-up">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Gestion des Questionnaires</h1>
          <p className="admin-page-sub">Configurez les questions de chaque diagnostic et adaptez le moteur de scoring en direct</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Colonne de Gauche : Liste des Diagnostics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-card">
              <div className="admin-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '0.94rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="var(--color-accent, #34BED5)" />
                  Diagnostics
                </h2>
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '680px', overflowY: 'auto' }}>
                {questionnaires.map(q => {
                  const isSelected = selectedModuleId === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuestionnaire(q.id)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--color-accent, #34BED5)' : '#e2e8f0',
                        background: isSelected ? 'rgba(52, 190, 213, 0.06)' : 'white',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--color-accent-dark, #1A9DB8)' : '#0f172a' }}>
                          {q.name}
                        </span>
                        <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '2px 6px', flexShrink: 0 }}>
                          {q.id}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {q.questionsCount} question{q.questionsCount > 1 ? 's' : ''}
                        </span>
                        {isSelected && <ChevronRight size={14} color="var(--color-accent, #34BED5)" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne de Droite : Liste des Questions */}
          <div className="admin-card" style={{ minHeight: '520px' }}>
            <div className="admin-card-header" style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedQuestionnaire ? selectedQuestionnaire.name : 'Veuillez sélectionner un diagnostic'}
                </h2>
                {selectedQuestionnaire && (
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Code de référence : <strong>{selectedQuestionnaire.id}</strong> · Temps estimé : <strong>{selectedQuestionnaire.estimatedTime || '—'}</strong>
                  </span>
                )}
              </div>

              {selectedQuestionnaire && (
                <button className="btn btn-teal btn-sm" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Ajouter une question
                </button>
              )}
            </div>

            <div style={{ padding: '24px' }}>
              {!selectedQuestionnaire ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--slate-400)', gap: '12px' }}>
                  <HelpCircle size={44} strokeWidth={1.5} color="#cbd5e1" />
                  <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>Veuillez sélectionner un diagnostic dans la colonne de gauche pour afficher et configurer ses questions.</p>
                </div>
              ) : (
                <>
                  {/* Search in questions list */}
                  <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <input
                      type="text"
                      placeholder="Filtrer les questions par mot-clé, ID ou axe..."
                      value={questionSearch}
                      onChange={e => setQuestionSearch(e.target.value)}
                      className="admin-filter-input"
                      style={{ width: '100%', paddingLeft: '38px', borderRadius: '10px' }}
                    />
                    <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    {questionSearch && (
                      <button
                        onClick={() => setQuestionSearch('')}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {Object.entries(groupedQuestions).map(([axeName, list]) => (
                      <div key={axeName} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Axe Section Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f1f5f9', paddingBottom: '6px', marginBottom: '4px' }}>
                          <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'var(--color-accent, #34BED5)' }} />
                          <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                            {axeName}
                          </h3>
                          <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.68rem', padding: '2px 6px' }}>
                            {list.length}
                          </span>
                        </div>

                        {/* Questions under this Axe */}
                        {list.map((q) => (
                          <div
                            key={q.id}
                            className="admin-sub-item-card animate-fade-in"
                            style={{
                              borderLeft: '4px solid var(--color-accent, #34BED5)',
                              padding: '16px 20px',
                              background: '#ffffff',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)',
                              border: '1px solid #f1f5f9',
                              borderLeftWidth: '4px',
                              borderRadius: '10px',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <span className="badge badge-blue" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px' }}>{q.id}</span>
                                  <span className="badge badge-slate" style={{ fontSize: '0.7rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 6px' }}>
                                    Coef: <strong>{q.weight || 0}</strong>
                                  </span>
                                  <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(52, 190, 213, 0.08)', color: 'var(--color-accent-dark, #1A9DB8)', padding: '2px 6px', fontWeight: 600 }}>
                                    {q.type === 'single' ? 'Choix unique' : q.type === 'multi' ? 'Choix multiples' : 'Curseur 1-5'}
                                  </span>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.94rem', marginTop: '8px', color: '#0f172a', lineHeight: 1.45 }}>{q.question}</div>
                              </div>

                              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => handleEditClick(q)}
                                  style={{ color: 'var(--color-blue)', padding: '6px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Edit size={14} /> Modifier
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => handleDelete(q.id)}
                                  style={{ color: 'var(--color-danger)', padding: '6px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Choices badge list */}
                            {q.choices && q.choices.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f8fafc' }}>
                                {q.choices.map((c, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      fontSize: '0.78rem',
                                      padding: '4px 10px',
                                      background: '#f8fafc',
                                      border: '1px solid #e2e8f0',
                                      borderRadius: '6px',
                                      color: '#334155',
                                      fontWeight: 500,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    {c.icon && <span style={{ marginRight: '2px' }}>{c.icon}</span>}
                                    {c.label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)', fontSize: '0.88rem' }}>
                        Aucune question ne correspond à votre filtre de recherche.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Add / Edit Question Modal */}
        {(editQuestion || newQuestion) && (
          <div className="admin-modal-backdrop" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}>
            <div className="admin-modal wide animate-scale-up" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleSave}>
                <div className="admin-modal-header">
                  <h3>{newQuestion ? 'Ajouter une question' : 'Éditer la question ' + qId}</h3>
                  <button className="admin-close-btn" type="button" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}><X size={18} /></button>
                </div>
                <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">ID Question (unique, ex: TRI-00-Q05)</label>
                      <input
                        type="text"
                        value={qId}
                        onChange={e => setQId(e.target.value)}
                        placeholder="TRI-00-Q05"
                        className="admin-form-input"
                        required
                        disabled={!newQuestion}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Axe / Dimension</label>
                      <input
                        type="text"
                        value={qAxe}
                        onChange={e => setQAxe(e.target.value)}
                        placeholder="Ex: entry_choice, finances..."
                        className="admin-form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Libellé de la question</label>
                    <textarea
                      value={qLabel}
                      onChange={e => setQLabel(e.target.value)}
                      placeholder="Saisissez la question..."
                      className="admin-form-input"
                      rows="2"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Type de composant</label>
                      <select value={qType} onChange={e => setQType(e.target.value)} className="admin-form-select">
                        <option value="ChoiceCard">ChoiceCard (Unique)</option>
                        <option value="CheckboxCard">CheckboxCard (Multiple)</option>
                        <option value="CurrencyInput">CurrencyInput (Devise)</option>
                        <option value="TextArea">TextArea (Texte libre)</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Condition d'affichage (facultatif)</label>
                      <input
                        type="text"
                        value={qCondition}
                        onChange={e => setQCondition(e.target.value)}
                        placeholder="Ex: TRI-00-Q01 === 'active'"
                        className="admin-form-input"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Poids de pondération (scoring)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={qWeight}
                        onChange={e => setQWeight(e.target.value)}
                        className="admin-form-input"
                      />
                    </div>
                  </div>

                  {/* Options / Choix pour ChoiceCard ou CheckboxCard */}
                  {(qType === 'ChoiceCard' || qType === 'CheckboxCard') && (
                    <div style={{ border: '1px solid var(--slate-200)', borderRadius: '12px', padding: '16px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <label className="admin-form-label" style={{ margin: 0, fontWeight: 700 }}>Options de réponse ({qChoices.length})</label>
                        <button
                          type="button"
                          onClick={addChoice}
                          className="btn btn-teal btn-xs"
                        >
                          + Ajouter une option
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {qChoices.map((choice, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="text"
                              placeholder="Texte de l'option..."
                              value={choice.label}
                              onChange={e => updateChoice(idx, 'label', e.target.value)}
                              className="admin-form-input"
                              style={{ flex: 1 }}
                              required
                            />
                            <input
                              type="text"
                              placeholder="Valeur (ex: active)..."
                              value={choice.value}
                              onChange={e => updateChoice(idx, 'value', e.target.value)}
                              className="admin-form-input"
                              style={{ maxWidth: '120px' }}
                              required
                            />
                            <input
                              type="number"
                              placeholder="Score"
                              value={choice.score}
                              onChange={e => updateChoice(idx, 'score', e.target.value)}
                              className="admin-form-input"
                              style={{ maxWidth: '80px' }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeChoice(idx)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '6px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="admin-modal-footer">
                  <button className="btn btn-ghost" type="button" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}>Annuler</button>
                  <button className="btn btn-teal" type="submit">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
      );
};
