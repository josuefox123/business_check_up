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
        // En cas de succès, retourner les questions formatées du backend
        return res || [];
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
