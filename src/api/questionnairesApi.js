import { apiFetch } from './config.js';
import { questionsApi } from './questionsApi.js';
import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const questionnairesApi = {
  getAll() {
    return apiFetch('/modules')
      .then(res => {
        const modulesList = res?.data?.modules || res?.modules || [];
        if (modulesList.length === 0) {
          throw new Error('No modules returned from backend');
        }
        return modulesList.map(m => ({
          id: m.code,
          name: m.name,
          questionsCount: m.question_count || 0,
          axes: ['Général']
        }));
      })
      .catch(err => {
        console.error('Error listing modules from backend:', err);
        throw err;
      });
  },
  
  getById(moduleId) {
    // Triage est un cas spécial local au front-end
    if (moduleId === 'triage') {
      const qData = LocalStoreRepository.getQuestionnaires();
      return Promise.resolve({
        id: 'triage',
        name: 'Formulaire de Triage',
        estimatedTime: '3 min',
        axes: ['Général'],
        questions: Object.values(qData.triage)
      });
    }

    return Promise.all([
      apiFetch(`/modules/${moduleId}`).catch(() => null),
      questionsApi.getByModule(moduleId).catch(() => [])
    ])
    .then(([modRes, questions]) => {
      const mod = modRes?.data || modRes;
      if (!mod || !mod.code) {
        throw new Error('Module detail lookup failed');
      }

      // Extraire les axes uniques de la liste des questions
      const axes = Array.from(new Set(questions.map(q => q.axe).filter(Boolean)));
      if (axes.length === 0) axes.push('Général');

      return {
        id: mod.code,
        name: mod.name,
        estimatedTime: mod.target_duration_formatted || mod.target_duration || '',
        axes: axes,
        questions: questions
      };
    })
    .catch(err => {
      console.error(`Error loading module detail for ${moduleId} from backend:`, err);
      throw err;
    });
  }
};
