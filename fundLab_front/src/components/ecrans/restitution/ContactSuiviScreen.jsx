import React, { useState } from 'react';
import { FileText, AlertOctagon } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';

export const ContactSuiviScreen = ({ onSubmit, onSkip, initialData }) => {
  const defaultNom = initialData?.full_name || initialData?.nom || localStorage.getItem('last_user_name') || '';
  const defaultEmail = initialData?.email || localStorage.getItem('last_user_email') || '';
  const defaultTel = initialData?.phone || initialData?.tel || localStorage.getItem('last_user_phone') || '';
  const defaultCompany = initialData?.company_name || initialData?.entreprise || '';

  const [form, setForm] = useState({
    nom: defaultNom,
    email: defaultEmail,
    tel: defaultTel,
    entreprise: defaultCompany,
    accept: false
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pdfBtnText = isSubmitting ? 'Traitement en cours...' : 'Télécharger mon résumé PDF';
  const suiviBtnText = isSubmitting ? 'Envoi en cours...' : 'Demander un suivi';

  const handleAction = async (actionType) => {
    setErrorMsg('');
    if (actionType === 'pdf') {
      if (!form.nom || !form.email) {
        setErrorMsg('Le nom et l\'adresse e-mail sont obligatoires pour recevoir le résumé PDF.');
        return;
      }
    } else if (actionType === 'suivi') {
      if (!form.nom || !form.tel) {
        setErrorMsg('Le nom et le numéro de téléphone / WhatsApp sont obligatoires pour être recontacté.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Schema compliant payload mapping (Rule 7)
      const payload = {
        nom: form.nom,
        email: form.email,
        tel: form.tel,
        entreprise: form.entreprise,
        full_name: form.nom,
        company_name: form.entreprise,
        phone: form.tel,
        action: actionType
      };

      await onSubmit(payload);
    } catch (err) {
      console.error('Erreur de soumission du formulaire de contact :', err);
      setErrorMsg(err?.message || '[submit_contact_error] Impossible d\'envoyer le formulaire. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <div className="animate-fade-up" style={{ maxWidth: '540px', margin: '0 auto', padding: '20px 20px' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-blue-light)', color: 'var(--color-blue)', marginBottom: '16px' }}>
            <FileText size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '10px' }}>
            Résumé &amp; Accompagnement
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            Laisser vos coordonnées est facultatif, sauf si vous souhaitez recevoir votre résumé ou être recontacté.
          </p>
        </div>

        <div style={{ background: 'var(--bg-white)', border: '1px solid var(--slate-200)', padding: '28px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          {errorMsg && (
            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
              <AlertOctagon size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="nom" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nom &amp; Prénom <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="text"
                id="nom"
                className="form-input"
                placeholder="Ex: Koffi SOGLO"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="entreprise" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nom de l'entreprise <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
              <input
                type="text"
                id="entreprise"
                className="form-input"
                placeholder="Ex: Ets Soglo &amp; Associés"
                value={form.entreprise}
                onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Adresse e-mail <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Ex: koffi@soglo.bj"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tel" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Téléphone / WhatsApp</label>
              <input
                type="tel"
                id="tel"
                className="form-input"
                placeholder="Ex: +229 01 90 90 90 90"
                value={form.tel}
                onChange={(e) => setForm({ ...form, tel: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button
              variant="teal"
              onClick={() => handleAction('pdf')}
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', gap: '8px', color: '#fff', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {pdfBtnText}
            </Button>
            <Button
              variant="primary"
              onClick={() => handleAction('suivi')}
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {suiviBtnText}
            </Button>
            <Button
              variant="outline"
              onClick={onSkip}
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', border: 'none', color: 'var(--slate-500)', textDecoration: 'underline' }}
            >
              Ignorer et terminer
            </Button>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};
