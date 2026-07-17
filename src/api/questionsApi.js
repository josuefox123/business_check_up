import { apiFetch } from './config.js';
import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const questionsApi = {
  getByModule(moduleId) {
    if (moduleId === 'triage') {
      const qData = LocalStoreRepository.getQuestionnaires();
      return Promise.resolve(Object.values(qData.triage));
    }
    
    return apiFetch(`/modules/${moduleId}/questions`)
      .then(res => {
        const questionsList = res?.data?.questions || res?.questions || (Array.isArray(res) ? res : []);
        
        if (questionsList.length === 0) {
          throw new Error('Backend returned empty questions list');
        }
        
        // Formater les questions du backend pour correspondre à l'interface frontend
        return questionsList.map(q => {
          let type = q.answer_type || 'single';
          if (type === 'single_choice') type = 'single';
          else if (type === 'multi_choice') type = 'multi';
          else if (type === 'scale_1_5') type = 'scale_1_5';
          else if (type === 'text_libre') type = 'text';

          const choices = (q.options || []).map(opt => ({
            id: opt.value,
            label: opt.label,
            icon: opt.icon || null,
            desc: opt.desc || null
          }));

          return {
            id: q.question_id,
            db_id: q.question_db_id || null,
            order: q.order || 1,
            axe: q.role || q.dimension || 'Général',
            question: q.text,
            hint: q.helper_text || null,
            type: type,
            choices: choices,
            requireProof: !!q.evidence_required
          };
        });
      })
      .catch(err => {
        console.error(`Error loading questions for ${moduleId} from backend, loading fallback:`, err);
        const qData = LocalStoreRepository.getQuestionnaires();
        if (qData.modules[moduleId]) {
          return qData.modules[moduleId].questions || [];
        }
        return [];
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
