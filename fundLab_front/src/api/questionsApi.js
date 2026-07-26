import { apiFetch } from './config.js';
import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const questionsApi = {
  getByModule(moduleId, questionKind) {
    const targetModuleId = moduleId === 'triage' ? 'TRI-00' : moduleId;
    const url = (questionKind && questionKind !== 'diagnostic')
      ? `/modules/${targetModuleId}/questions?question_kind=${questionKind}`
      : `/modules/${targetModuleId}/questions`;

    return apiFetch(url)
      .then(res => {
        const rawQuestions = res?.data?.questions || res?.questions || res?.data || res;
        const questionsList = Array.isArray(rawQuestions) ? rawQuestions : [];
        
        if (questionsList.length === 0) {
          throw new Error('Backend returned empty questions list');
        }
        
        // Formater les questions du backend pour correspondre à l'interface frontend
        return questionsList.map((q, idx) => {
          let type = q.answer_type || q.type || 'single';
          if (type === 'single_choice') type = 'single';
          else if (type === 'multi_choice') type = 'multi';
          else if (type === 'scale_1_5') type = 'scale_1_5';
          else if (type === 'text_libre') type = 'short_text';

          const rawChoices = q.options || q.choices || [];
          const choices = rawChoices.map(opt => ({
            id: opt.value !== undefined ? opt.value : (opt.id || opt.code),
            label: opt.label || opt.text || opt.title || '',
            icon: opt.icon || null,
            desc: opt.desc || opt.description || null
          }));

          const qDbId = q.id || q.question_db_id || q.db_id || null;
          const qId = q.question_code || q.question_id || q.code || qDbId || `${targetModuleId}_Q${idx + 1}`;

          return {
            id: qId,
            db_id: qDbId,
            order: q.order || (idx + 1),
            axe: q.role || q.dimension || 'Général',
            question: q.text || q.label || q.question || '',
            hint: q.helper_text || q.hint || null,
            type: type,
            choices: choices,
          };
        });
      })
      .catch(err => {
        console.warn(`[questionsApi] Backend endpoint for module ${moduleId} unavailable (${err.message}). Using local questions.`);
        const localData = LocalStoreRepository.getQuestionsByModule(targetModuleId);
        return localData || [];
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
