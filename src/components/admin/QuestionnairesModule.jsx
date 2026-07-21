import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, Plus, Edit } from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';

export const QuestionnairesModule = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState(false);

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

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des Questionnaires</h1>
        <p className="admin-page-sub">Configurez les questions de chaque diagnostic et adaptez le moteur de scoring en direct</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Module Selection Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Sélectionnez un diagnostic</h2>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {questionnaires.map(q => (
              <button 
                key={q.id}
                onClick={() => handleSelectQuestionnaire(q.id)}
                style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--slate-200)',
                  background: selectedModuleId === q.id ? 'var(--brand-blue-light)' : 'white',
                  color: selectedModuleId === q.id ? 'var(--color-primary)' : 'var(--slate-700)',
                  fontWeight: selectedModuleId === q.id ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{q.name} ({q.id})</span>
                <span className="badge badge-slate" style={{ background: 'var(--slate-100)' }}>{q.questionsCount} questions</span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions List Card */}
        <div className="admin-card" style={{ gridColumn: 'span 2' }}>
          <div className="admin-card-header">
            <h2>Questions de : {selectedQuestionnaire?.name || 'Aucun sélectionné'}</h2>
            {selectedQuestionnaire && (
              <button className="btn btn-teal btn-sm" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={16} /> Ajouter une question
              </button>
            )}
          </div>
          <div style={{ padding: '16px' }}>
            {!selectedQuestionnaire ? (
              <p style={{ color: 'var(--slate-400)', textAlign: 'center', padding: '40px' }}>Veuillez sélectionner un diagnostic dans la colonne de gauche.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {questions.map((q) => (
                  <div key={q.id} className="admin-sub-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div>
                        <span className="badge badge-blue" style={{ marginRight: '6px' }}>{q.id}</span>
                        {q.axe && <span className="admin-badge-severity moyen" style={{ marginRight: '6px' }}>{q.axe}</span>}
                        <span className="admin-badge-severity élevé" style={{ marginRight: '6px' }}>Coef: {q.weight || 0}</span>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '6px', color: 'var(--color-primary)' }}>{q.question}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(q)} style={{ color: 'var(--color-blue)' }}><Edit size={14} /> Éditer</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(q.id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </div>

                    {q.choices && q.choices.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                        {q.choices.map((c, i) => (
                          <span key={i} style={{ fontSize: '0.78rem', padding: '3px 8px', background: 'white', border: '1px solid var(--slate-200)', borderRadius: '6px' }}>
                            {c.icon && <span style={{ marginRight: '4px' }}>{c.icon}</span>}
                            {c.label} <strong style={{ color: 'var(--color-blue)' }}>({c.score} pts)</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      {(editQuestion || newQuestion) && (
        <div className="admin-modal-backdrop" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}>
          <div className="admin-modal wide" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="admin-modal-header">
                <h3>{newQuestion ? 'Ajouter une question' : 'Éditer la question ' + qId}</h3>
                <button className="admin-close-btn" type="button" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}><X size={18} /></button>
              </div>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">ID Unique</label>
                    <input 
                      type="text" 
                      value={qId} 
                      onChange={e => setQId(e.target.value)} 
                      disabled={!newQuestion}
                      className="admin-form-input" 
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Axe diagnostique (Catégorie)</label>
                    <input 
                      type="text" 
                      value={qAxe} 
                      onChange={e => setQAxe(e.target.value)} 
                      className="admin-form-input"
                      placeholder="Ex: Finance, Commercial, ..."
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Libellé de la question</label>
                  <input 
                    type="text" 
                    value={qText} 
                    onChange={e => setQText(e.target.value)} 
                    className="admin-form-input" 
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Type de réponse</label>
                    <select value={qType} onChange={e => setQType(e.target.value)} className="admin-form-select">
                      <option value="single">Choix unique (Radio)</option>
                      <option value="multi">Choix multiples (Checkbox)</option>
                      <option value="scale_1_5">Curseur linéaire (1 à 5)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Coefficient / Poids (score total)</label>
                    <input 
                      type="number" 
                      value={qWeight} 
                      onChange={e => setQWeight(e.target.value)} 
                      className="admin-form-input" 
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {qType !== 'scale_1_5' && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Options de choix de réponse</h4>
                      <button className="btn btn-ghost btn-sm" type="button" onClick={addChoice} style={{ color: 'var(--color-blue)' }}>
                        <Plus size={14} /> Ajouter une option
                      </button>
                    </div>
                    {qChoices.map((choice, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Icône/Emoji (Optionnel)" 
                          value={choice.icon || ''}
                          onChange={e => updateChoice(idx, 'icon', e.target.value)}
                          className="admin-form-input"
                          style={{ maxWidth: '80px' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Intitulé du choix de réponse" 
                          value={choice.label}
                          onChange={e => updateChoice(idx, 'label', e.target.value)}
                          className="admin-form-input"
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
                        <button type="button" onClick={() => removeChoice(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="admin-modal-footer">
                <button className="btn btn-ghost" type="button" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}>Annuler</button>
                <button className="btn btn-primary" type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
