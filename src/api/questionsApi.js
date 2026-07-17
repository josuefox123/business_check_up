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
    const method = question.id ? 'PUT' : 'POST';
    const endpoint = question.id ? `/admin/questions/${question.id}` : '/admin/questions';
    
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
    return apiFetch(`/admin/questions/${qId}`, {
      method: 'DELETE'
    })
    .then(() => true)
    .catch(err => {
      console.error('Error deleting question on backend, deleting locally:', err);
      LocalStoreRepository.deleteQuestion(moduleId, qId);
      return true;
    });
  }
};
