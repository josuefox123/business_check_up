import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { History, Construction, ArrowLeft, Calendar, FileText, ChevronRight, AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const DiagnosticHistoryScreen = ({
  onBack,
  userEmail,
  historyItems = [],
  onSelectRun,
  isLoading = false,
  isError = false,
  onRetry
}) => {
  const navigate = useNavigate();
  const accountEmail = userEmail || localStorage.getItem('bc_user_email') || null;
  const hasHistoryItems = !isLoading && !isError && historyItems.length > 0;
  const showEmptyState = !isLoading && !isError && historyItems.length === 0;

  // Extract, declare and normalize API data before rendering (Rule 9)
  const normalizedHistoryItems = (historyItems || []).map((item, idx) => {
    return {
      runId: item?.diagnostic_run_id || `RUN-${idx}`,
      moduleName: item?.module_name || item?.module_code || '[module_name non disponible]',
      score: item?.scoring?.converted_score_0_100 ?? item?.score ?? null,
      completedAt: item?.completed_at ? new Date(item.completed_at).toLocaleDateString('fr-FR') : '[completed_at non disponible]',
      bandLabel: item?.scoring?.band_label || item?.band_label || null,
      originalItem: item
    };
  });

  return (
    <ScreenWrapper wide>
      <TopBackLink onClick={() => navigate(-1)} />
      <div style={{ maxWidth: '720px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px',
            borderRadius: '20px',
            background: 'rgba(52, 190, 213, 0.12)',
            color: '#1A9DB8',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(52, 190, 213, 0.15)'
          }}>
            <History size={32} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17212D', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Historique de vos Diagnostics
          </h1>

          {accountEmail && (
            <div style={{ display: 'inline-block', background: '#F1F5F9', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.86rem', fontWeight: 600, color: '#475569' }}>
              Compte : {accountEmail}
            </div>
          )}
        </div>

        {/* Error state with localized retry */}
        {isError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '24px' }}>
            <AlertOctagon size={28} style={{ color: '#DC2626', marginBottom: '8px' }} />
            <p style={{ fontSize: '0.9rem', color: '#991B1B', fontWeight: 600, marginBottom: '12px' }}>
              [fetch_history_error] Impossible de charger votre historique de diagnostics.
            </p>
            {onRetry && (
              <Button variant="outline" onClick={onRetry} size="sm" style={{ gap: '6px' }}>
                <RotateCcw size={14} />
                <span>Réessayer</span>
              </Button>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>Chargement de votre historique...</p>
          </div>
        )}

        {/* Dynamic History List if available */}
        {hasHistoryItems && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {normalizedHistoryItems.map((item) => (
              <div
                key={item.runId}
                onClick={() => onSelectRun && onSelectRun(item.originalItem)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: onSelectRun ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F0FDFA', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1E293B', margin: '0 0 4px 0' }}>
                      {item.moduleName}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: '#64748B' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {item.completedAt}
                      </span>
                      {item.bandLabel && (
                        <span style={{ fontWeight: 600, color: '#0D9488' }}>
                          {item.bandLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.score !== null && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{item.score}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/100</span>
                    </div>
                  )}
                  {onSelectRun && <ChevronRight size={18} style={{ color: '#CBD5E1' }} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty history state / under construction fallback */}
        {showEmptyState && (
          <div style={{
            background: '#FFFFFF',
            border: '1.5px dashed #CBD5E1',
            borderRadius: '20px',
            padding: '40px 24px',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <Construction size={40} style={{ color: '#F59E0B', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
              Espace Historique en construction
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
              Cet espace vous permettra de retrouver l'ensemble de vos diagnostics passés, vos scores et vos rapports PDF téléchargeables.
            </p>
          </div>
        )}

        {onBack && (
          <div style={{ textAlign: 'center' }}>
            <Button variant="outline" onClick={onBack} style={{ borderRadius: '12px', fontWeight: 700 }}>
              <ArrowLeft size={16} style={{ marginRight: '8px' }} />
              <span>Retour à l'accueil</span>
            </Button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};
