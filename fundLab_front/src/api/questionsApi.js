import { apiFetch } from './config.js';
import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const questionsApi = {
  getTriageQuestions() {
    return this.getByModule('TRI-00', 'triage');
  },

  getDiagnosticQuestions(moduleCode) {
    return this.getByModule(moduleCode, 'diagnostic');
  },

  getEnrichmentQuestions(moduleCode) {
    return this.getByModule(moduleCode, 'enrichment');
  },

  getByModule(moduleId, questionKind = 'diagnostic') {
    const targetModuleId = moduleId === 'triage' ? 'TRI-00' : moduleId;
    const kind = questionKind || 'diagnostic';
    const url = `/modules/${targetModuleId}/questions?question_kind=${kind}`;

    return apiFetch(url)
      .then(res => {
        const rawQuestions = res?.data?.questions || res?.questions || res?.data || res;
        const questionsList = Array.isArray(rawQuestions) ? rawQuestions : [];
        
        // Si le backend renvoie 0 questions pour cette catégorie, renvoyer un tableau vide sans lever d'exception
        if (questionsList.length === 0) {
          console.info(`[questionsApi] Zero questions returned for module "${targetModuleId}" (kind: ${kind}).`);
          return [];
        }
        
        // Formater et assainir les questions du backend
        return questionsList
          .filter(Boolean)
          .map((q, idx) => {
            let type = q.answer_type || q.type || 'single';
            if (type === 'single_choice') type = 'single';
            else if (type === 'multi_choice') type = 'multi';
            else if (type === 'scale_1_5') type = 'scale_1_5';
            else if (type === 'text_libre') type = 'short_text';

            const rawChoices = q.options || q.choices || [];
            const choices = rawChoices
              .filter(Boolean)
              .map(opt => {
                const optValue = (opt.value !== undefined && opt.value !== null && opt.value !== '')
                  ? String(opt.value)
                  : String(opt.id || opt.code || `opt_${idx}`);
                return {
                  id: optValue,
                  value: optValue,
                  label: opt.label || opt.text || opt.title || '[option_label non disponible]',
                  icon: opt.icon || null,
                  desc: opt.desc || opt.description || null
                };
              });

            const qDbId = q.id || q.question_db_id || q.db_id || null;
            const qId = q.question_code || q.question_id || q.code || qDbId || `${targetModuleId}_Q${idx + 1}`;

            return {
              id: qId,
              db_id: qDbId,
              order: q.order || (idx + 1),
              axe: q.role || q.dimension || 'Général',
              question: q.text || q.label || q.question || '[question_text non disponible]',
              hint: q.helper_text || q.hint || null,
              type: type,
              choices: choices,
            };
          });
      })
      .catch(err => {
        console.warn(`[questionsApi] Backend endpoint for module "${targetModuleId}" (kind: ${kind}) error:`, err?.message || err);
        const localData = LocalStoreRepository.getQuestionsByModule(targetModuleId);
        if (localData && localData.length > 0) {
          return localData;
        }
        // Enrichir l'erreur réseau pour permettre un traitement propre par la vue
        const enrichedError = new Error(err?.message || `Impossible de charger les questions pour ${targetModuleId}`);
        enrichedError.moduleCode = targetModuleId;
        enrichedError.questionKind = kind;
        enrichedError.isNetworkError = typeof window !== 'undefined' && window.navigator && window.navigator.onLine === false;
        throw enrichedError;
      });
  },
  
  save(moduleId, question) {
    // Admin request (authenticated via bearer token automatically inside apiFetch wrapper)
    const dbId = question.db_id;
    const method = dbId ? 'PUT' : 'POST';
    const endpoint = dbId ? `/admin/questions/${dbId}` : '/admin/questions';
    
    return apiFetch(endpoint, {
      method,
      body: JSON.stringify({ module_code: moduleId, ...question })
    })
    .catch(err => {
      console.error('Error saving question on backend, saving locally:', err);
      LocalStoreRepository.saveQuestion(moduleId, question);
      return question;
    });
  },
  
  delete(moduleId, qId) {
    // Si on a un identifiant technique db_id, l'utiliser, sinon repli sur l'id technique
    const targetId = typeof qId === 'object' ? qId.db_id : qId;
    return apiFetch(`/admin/questions/${targetId}`, {
      method: 'DELETE'
    })
    .then(() => true)
    .catch(err => {
      console.error('Error deleting question on backend, deleting locally:', err);
      LocalStoreRepository.deleteQuestion(moduleId, typeof qId === 'object' ? qId.id : qId);
      return true;
    });
  }
};
