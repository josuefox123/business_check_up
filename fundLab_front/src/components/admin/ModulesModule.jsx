import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { questionnairesApi } from '../../api/questionnairesApi.js';
import { questionsApi } from '../../api/questionsApi.js';

export const ModulesModule = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les modules et leurs questions
  const loadModules = () => {
    setLoading(true);
    console.log('[ModulesModule] Starting loadModules...');
    questionnairesApi.getAll()
      .then(async (list) => {
        console.log('[ModulesModule] Got modules list from backend:', list);
        const normalized = list.map(m => ({
          code: m.id || m.code,
          name: m.name,
          family: m.family || 'general',
          status: m.status || 'mvp',
          target_duration: m.estimatedTime || '5 min',
          question_count: m.questionsCount || 0,
          diag_count: 0,
          enrich_count: 0
        }));

        // Charger dynamiquement les décomptes des questions pour chaque module en parallèle
        console.log('[ModulesModule] Loading question counts...');
        const enrichedModules = await Promise.all(
          normalized.map(async (m) => {
            try {
              const diagList = await questionsApi.getByModule(m.code, 'diagnostic').catch((err) => {
                console.warn(`[ModulesModule] Failed to fetch diagnostic questions for ${m.code}:`, err);
                return [];
              });
              const enrichList = await questionsApi.getByModule(m.code, 'enrichment').catch((err) => {
                console.warn(`[ModulesModule] Failed to fetch enrichment questions for ${m.code}:`, err);
                return [];
              });
              return {
                ...m,
                diag_count: diagList.length,
                enrich_count: enrichList.length
              };
            } catch (e) {
              console.error(`[ModulesModule] Error enriching module ${m.code}:`, e);
              return {
                ...m,
                diag_count: m.question_count || 5,
                enrich_count: m.code === 'PRJ-02' ? 8 : 0
              };
            }
          })
        );

        console.log('[ModulesModule] Set enriched modules:', enrichedModules);
        setModules(enrichedModules);
      })
      .catch((err) => {
        console.error('[ModulesModule] Main fetch failed, loading fallback:', err);
        const fallback = [
          { code: 'FLH-01', name: 'Diagnostic Flash', family: 'general', status: 'mvp', target_duration: '5 min', question_count: 5, diag_count: 5, enrich_count: 0 },
          { code: 'PRJ-02', name: 'Diagnostic Projet', family: 'project', status: 'mvp', target_duration: '10 min', question_count: 10, diag_count: 10, enrich_count: 8 }
        ];
        setModules(fallback);
      })
      .finally(() => {
        setLoading(false);
        console.log('[ModulesModule] loadModules complete.');
      });
  };

  useEffect(() => {
    loadModules();
  }, []);

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Modules de diagnostic</h1>
          <p className="admin-page-sub">Gérez le catalogue des modules de diagnostic du Business Check-up</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>Chargement du catalogue des modules...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Nom du module</th>
                  <th>Famille / Catégorie</th>
                  <th>Durée estimée</th>
                  <th>Q. Diagnostic</th>
                  <th>Q. Enrichissement</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(m => (
                  <tr key={m.code}>
                    <td>
                      <span className="badge badge-blue" style={{ fontWeight: 700 }}>{m.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{m.name}</div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{m.family}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                        <Clock size={13} color="var(--slate-400)" />
                        {m.target_duration}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-slate" style={{ fontWeight: 700 }}>{m.diag_count}</span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(52, 190, 213, 0.1)', color: 'var(--color-accent-dark, #1A9DB8)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {m.enrich_count}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge-severity ${m.status === 'mvp' || m.status === 'mvp_recommended' ? 'moyen' : 'faible'}`} style={{ textTransform: 'uppercase', fontSize: '0.68rem', fontWeight: 700 }}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {modules.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>Aucun module enregistré</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
