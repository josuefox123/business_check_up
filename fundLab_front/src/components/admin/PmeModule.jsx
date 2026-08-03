import React, { useState, useRef, useEffect } from 'react';
import { Building2, Search, Info, X, MapPin, Phone, Mail, User, CheckCircle2, XCircle, RotateCcw, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { EntrepriseService } from '../../services/EntrepriseService.js';
import { exportToExcel } from '../../utils/exportToExcel.js';

// Rule 7: Mapping exact des valeurs API vers libellés français
const ACTIVITY_STAGE_LABELS = {
  'not_launched': 'Non lancée',
  'launched': 'En activité',
  'growth': 'En croissance',
  'restructuring': 'En restructuration',
  'structured_activity': 'Activité structurée',
  'occasional_sales': 'Ventes occasionnelles',
  'regular_sales': 'Ventes régulières',
  'declining_sales': 'Ventes en baisse',
  'project': 'En projet',
  'pre_launch': 'Pré-lancement',
  'stagnant': 'Activité stagnante',
  'pivot': 'En repositionnement',
};

const USER_PROFILE_LABELS = {
  'structured_sme': 'PME structurée',
  'informal_sme': 'PME / Indépendant',
  'opportunity_seeker': 'Chercheur d\'opportunité',
  'project_holder': 'Porteur de projet',
  'cooperative': 'Coopérative / Groupement',
  'entrepreneur': 'Entrepreneur',
  'individual': 'Particulier',
  'active_entrepreneur': 'Entrepreneur actif',
};

const formatActivityStage = (stage) => {
  if (!stage) return null;
  return ACTIVITY_STAGE_LABELS[stage] ?? stage;
};

const formatUserProfile = (profile) => {
  if (!profile) return null;
  return USER_PROFILE_LABELS[profile] ?? profile;
};

// Composant popover inline (tooltip style sombre)
const InfoPopover = ({ pme, onClose }) => {
  const user = pme.user ?? null;

  const fields = [
    pme.legal_status && { label: 'Statut légal', value: pme.legal_status },
    pme.maturity_phase && { label: 'Phase de maturité', value: pme.maturity_phase },
    pme.employee_count_range && { label: 'Effectif', value: `${pme.employee_count_range} employés` },
    pme.monthly_revenue_range_xof && { label: 'CA mensuel', value: `${pme.monthly_revenue_range_xof} FCFA` },
    pme.ca_n_1 && { label: 'CA N-1', value: pme.ca_n_1 },
    pme.ca_m_1 && { label: 'CA M-1', value: pme.ca_m_1 },
    pme.customer_type && { label: 'Clients', value: pme.customer_type },
    pme.sales_channel_main && { label: 'Canal vente', value: pme.sales_channel_main },
    pme.years_in_activity != null && { label: 'Années d\'activité', value: `${pme.years_in_activity} an(s)` },
    pme.description && { label: 'Description', value: pme.description },
    user?.preferred_contact_channel && { label: 'Contact pref.', value: user.preferred_contact_channel },
    user?.user_profile_type && { label: 'Profil', value: formatUserProfile(user.user_profile_type) },
  ].filter(Boolean);

  const docs = [];
  if (pme.ifu_available != null) docs.push({ label: 'IFU', ok: Boolean(pme.ifu_available) });
  if (pme.rccm_available != null) docs.push({ label: 'RCCM', ok: Boolean(pme.rccm_available) });
  if (pme.bank_account_available != null) docs.push({ label: 'Compte bancaire', ok: Boolean(pme.bank_account_available) });

  return (
    <div style={{
      position: 'absolute', right: '44px', top: '50%', transform: 'translateY(-50%)',
      zIndex: 100, width: '290px',
      background: '#1E293B', color: '#E2E8F0',
      borderRadius: '16px', padding: '16px 18px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.32)',
      animation: 'fadeInScale 0.15s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#F1F5F9', lineHeight: 1.3 }}>
            {pme.business_name || 'PME'}
          </div>
          {pme.sector && (
            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '2px' }}>{pme.sector}</div>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', lineHeight: 0, flexShrink: 0 }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Fields list */}
      {fields.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: docs.length > 0 ? '10px' : 0 }}>
          {fields.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '6px', fontSize: '0.78rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>{f.label}</span>
              <span style={{ color: '#CBD5E1', wordBreak: 'break-word' }}>{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Docs compliance */}
      {docs.length > 0 && (
        <div style={{ borderTop: '1px solid #334155', paddingTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {docs.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: d.ok ? '#4ADE80' : '#F87171', fontWeight: 600 }}>
              {d.ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />} {d.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PmeModule = () => {
  const [pmes, setPmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const loadPmes = () => {
    setLoading(true);
    setErrorMsg('');
    EntrepriseService.getEnterprises()
      .then(data => {
        setPmes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('[PmeModule] Error loading PMEs:', err);
        setErrorMsg('[pmes_fetch_error] Impossible de charger la liste des PME. Veuillez ré-essayer.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPmes();
  }, []);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-popover-row]')) setOpenPopoverId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Deduplicate PMEs by contact email (or fallback to business name/id)
  const seenEmails = new Set();
  const distinctPmes = pmes.filter(pme => {
    const user = pme.user ?? null;
    const email = (user?.email || pme.email || pme.user_email || '').trim().toLowerCase();
    const key = email || (pme.business_name || pme.name || pme.business_id || pme.id);
    if (!key) return true;
    if (seenEmails.has(key)) return false;
    seenEmails.add(key);
    return true;
  });

  const filteredPmes = distinctPmes.filter(pme => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const userName = pme.user?.full_name?.toLowerCase() ?? '';
    const userEmail = pme.user?.email?.toLowerCase() ?? '';
    const userPhone = pme.user?.phone_number?.toLowerCase() ?? '';
    return (
      (pme.business_name && pme.business_name.toLowerCase().includes(term)) ||
      (pme.sector && pme.sector.toLowerCase().includes(term)) ||
      (pme.region && pme.region.toLowerCase().includes(term)) ||
      (pme.commune && pme.commune.toLowerCase().includes(term)) ||
      userName.includes(term) ||
      userEmail.includes(term) ||
      userPhone.includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredPmes.length / itemsPerPage));
  const paginatedPmes = filteredPmes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const headers = ['Nom Entreprise', 'Contact Nom', 'Email', 'Téléphone', 'WhatsApp', 'Secteur', 'Sous-secteur', 'Région', 'Commune', 'Pays', 'Stade d\'activité', 'Statut légal', 'Effectif', 'CA mensuel (FCFA)', 'Années d\'activité', 'IFU', 'RCCM', 'Compte bancaire'];
    const rows = filteredPmes.map(p => {
      const u = p.user ?? {};
      return [
        p.business_name ?? '',
        u.full_name ?? '',
        u.email ?? '',
        u.phone_number ?? '',
        u.whatsapp_number ?? '',
        p.sector ?? '',
        p.sub_sector ?? '',
        p.region ?? '',
        p.commune ?? '',
        p.country ?? '',
        formatActivityStage(p.activity_stage) ?? '',
        p.legal_status ?? '',
        p.employee_count_range ?? '',
        p.monthly_revenue_range_xof ?? '',
        p.years_in_activity != null ? String(p.years_in_activity) : '',
        p.ifu_available ? 'Oui' : 'Non',
        p.rccm_available ? 'Oui' : 'Non',
        p.bank_account_available ? 'Oui' : 'Non',
      ];
    });
    exportToExcel([headers, ...rows], 'pmes_export');
  };

  return (
    <div className="admin-page animate-fade-up">
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translateY(-50%) scale(0.96); }
          to   { opacity: 1; transform: translateY(-50%) scale(1); }
        }
      `}</style>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Entreprises (PME)</h1>
          <p className="admin-page-sub">Consultez la liste des PME enregistrées et les coordonnées des dirigeants</p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Exporter en Excel"
        >
          <Download size={14} /> Exporter
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Rechercher par PME, contact, secteur..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '10px', border: '1px solid var(--adm-border)', outline: 'none', fontSize: '0.875rem', background: 'var(--adm-bg)', color: 'var(--adm-text)', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ fontSize: '0.86rem', color: 'var(--slate-500)', fontWeight: 600 }}>
          Total : <strong style={{ color: 'var(--brand-blue)' }}>{filteredPmes.length}</strong> PME
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>Chargement des PME...</div>
        ) : errorMsg ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>{errorMsg}</span>
            <button onClick={loadPmes} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '6px 12px', color: '#991B1B', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
              <RotateCcw size={14} /> Réessayer
            </button>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Contact / Dirigeant</th>
                    <th>Secteur / Sous-secteur</th>
                    <th>Localisation</th>
                    <th>Stade d'activité</th>
                    <th style={{ textAlign: 'right' }}>Détails</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPmes.map((pme, idx) => {
                    // Rule 9: normalisation avant le rendu JSX
                    const pmeId = pme.business_id ?? pme.id ?? idx;
                    const name = pme.business_name ?? 'Nom non spécifié';
                    const sector = pme.sector ?? null;
                    const subSector = pme.sub_sector ?? null;
                    const region = pme.region ?? null;
                    const commune = pme.commune ?? null;
                    const country = pme.country ?? null;
                    const activityStageLabel = formatActivityStage(pme.activity_stage);
                    const isOpen = openPopoverId === pmeId;

                    // Normalisation des infos utilisateur liées
                    const user = pme.user ?? null;
                    const contactName = user?.full_name ?? null;
                    const contactEmail = user?.email ?? null;
                    const contactPhone = user?.phone_number ?? null;
                    const contactWhatsapp = user?.whatsapp_number ?? null;
                    const userProfileLabel = formatUserProfile(user?.user_profile_type);

                    return (
                      <tr key={pmeId} data-popover-row="true" style={{ position: 'relative' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Building2 size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--adm-text, #0F172A)', fontSize: '0.9rem' }}>{name}</div>
                              {pme.year_created && <div style={{ fontSize: '0.74rem', color: 'var(--slate-400)' }}>Créée en {pme.year_created}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          {user ? (
                            <div>
                              {contactName && (
                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <User size={13} color="var(--brand-blue)" /> {contactName}
                                </div>
                              )}
                              {userProfileLabel && (
                                <div style={{ fontSize: '0.72rem', color: '#475569', background: '#F1F5F9', padding: '1px 6px', borderRadius: '4px', width: 'fit-content', marginTop: '2px', fontWeight: 600 }}>
                                  {userProfileLabel}
                                </div>
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '3px', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                                {contactEmail && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Mail size={12} color="var(--slate-400)" />
                                    <a href={`mailto:${contactEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contactEmail}</a>
                                  </div>
                                )}
                                {contactPhone && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Phone size={12} color="var(--slate-400)" />
                                    <a href={`tel:${contactPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contactPhone}</a>
                                  </div>
                                )}
                                {contactWhatsapp && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontWeight: 600 }}>
                                    <Phone size={12} /> WA: {contactWhatsapp}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>Non renseigné</span>
                          )}
                        </td>
                        <td>
                          {sector && (
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--slate-700)', fontSize: '0.84rem' }}>{sector}</div>
                              {subSector && <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{subSector}</div>}
                            </div>
                          )}
                        </td>
                        <td>
                          {(region || commune || country) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                              <MapPin size={13} color="var(--slate-400)" />
                              {[commune, region, country].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </td>
                        <td>
                          {activityStageLabel && (
                            <span style={{ background: '#E0F2FE', color: '#0369A1', fontWeight: 600, fontSize: '0.76rem', padding: '3px 8px', borderRadius: '6px' }}>
                              {activityStageLabel}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right', position: 'relative' }}>
                          <button
                            onClick={() => setOpenPopoverId(isOpen ? null : pmeId)}
                            style={{
                              background: isOpen ? '#1E293B' : 'transparent',
                              border: '1px solid',
                              borderColor: isOpen ? '#1E293B' : 'var(--adm-border, #E2E8F0)',
                              color: isOpen ? '#F1F5F9' : '#2563EB',
                              borderRadius: '8px', padding: '5px 8px',
                              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px',
                              fontSize: '0.75rem', fontWeight: 600,
                              transition: 'all 0.15s ease',
                            }}
                            title="Voir les informations détaillées"
                          >
                            <Info size={15} />
                          </button>

                          {/* Inline tooltip popover */}
                          {isOpen && (
                            <InfoPopover pme={pme} onClose={() => setOpenPopoverId(null)} />
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredPmes.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>
                        Aucune PME trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--adm-border, #E2E8F0)', background: 'var(--adm-bg, #FFFFFF)', borderRadius: '0 0 16px 16px' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600 }}>
                  Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong> ({filteredPmes.length} PME)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    style={{
                      border: '1px solid #CBD5E1',
                      background: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                      color: currentPage === 1 ? '#94A3B8' : '#0F172A',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  >
                    <ChevronLeft size={16} /> Précédent
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    style={{
                      border: '1px solid #CBD5E1',
                      background: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF',
                      color: currentPage === totalPages ? '#94A3B8' : '#0F172A',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  >
                    Suivant <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

