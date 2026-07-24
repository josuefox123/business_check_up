import React, { useState, useEffect } from 'react';
import { Award, Calendar, Clock, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';

/* ─── Génération des créneaux horaires ─── */
// Plage matin : 09:00 → 11:40 (dernier début), pause 12:00-14:00
// Plage après-midi : 14:00 → 17:20 (dernier début)
// Durée séance : 30 min | Pause entre séances : 10 min → incrément : 40 min
// Fin journée : 18h00
const generateSlots = () => {
  const slots = [];
  const addSlot = (h, m) => {
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const endH = m + 30 >= 60 ? h + 1 : h;
    const endM = (m + 30) % 60;
    slots.push({
      time: `${hStr}:${mStr}`,
      endTime: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
      label: `${hStr}h${mStr === '00' ? '' : mStr}`,
    });
  };

  // Matin : 09:00, 09:40, 10:20, 11:00, 11:40
  let h = 9, m = 0;
  while (h < 12) {
    addSlot(h, m);
    m += 40;
    if (m >= 60) { h++; m -= 60; }
    if (h === 11 && m === 40) { addSlot(11, 40); break; }
  }

  // Après-midi : 14:00, 14:40, 15:20, 16:00, 16:40, 17:20
  h = 14; m = 0;
  while (!(h === 17 && m > 20) && !(h >= 18)) {
    addSlot(h, m);
    m += 40;
    if (m >= 60) { h++; m -= 60; }
  }

  return slots;
};

const TIME_SLOTS = generateSlots();

/* ─── Génération des jours ouvrés ─── */
const generateWorkdays = (count = 10) => {
  const days = [];
  const now = new Date();
  let current = new Date(now);
  current.setDate(current.getDate() + 1);
  current.setHours(0, 0, 0, 0);

  while (days.length < count) {
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const WORKDAYS = generateWorkdays(10);

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const DAYS_FR = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
const DAYS_FULL_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const formatDayShort = (d) =>
  `${DAYS_FR[d.getDay()]}. ${d.getDate()} ${MONTHS_FR[d.getMonth()].slice(0, 4)}.`;

const formatDayFull = (d) =>
  `${DAYS_FULL_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;

/* ════════════════════════════════════════════ */
export const FinParcoursScreen = ({ onRestart, onShare }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dayOffset, setDayOffset] = useState(0); // for pagination of days
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const daysPerPage = isMobile ? 4 : 5;
  const visibleDays = WORKDAYS.slice(dayOffset, dayOffset + daysPerPage);

  const selectedDay = WORKDAYS[selectedDayIndex];
  const selectedSlotObj = selectedTime
    ? TIME_SLOTS.find(s => s.time === selectedTime)
    : null;

  const handleBookAppointment = async () => {
    if (!selectedTime || !selectedDay) return;
    setIsSubmitting(true);

    const runId = localStorage.getItem('last_run_id');
    const name = localStorage.getItem('last_user_name') || 'Anonyme';
    const email = localStorage.getItem('last_user_email') || null;
    const phone = localStorage.getItem('last_user_phone') || '00000000';
    const whatsapp = localStorage.getItem('last_user_whatsapp') || phone;
    const slotLabel = `${formatDayFull(selectedDay)} à ${selectedTime}`;

    if (!runId) {
      setTimeout(() => { setIsSubmitting(false); setBooked(true); setShowModal(false); }, 800);
      return;
    }

    try {
      const response = await fetch(`/api/bc/diagnostics/${runId}/follow-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: `${name} (RDV: ${slotLabel})`,
          phone_number: phone,
          whatsapp_number: whatsapp,
          email,
          follow_up_need_type: 'diagnostic_expert',
          preferred_contact_channel: 'phone'
        })
      });
      if (!response.ok) throw new Error('Failed');
      setBooked(true); setShowModal(false);
    } catch {
      setBooked(true); setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    ['last_run_id', 'last_user_name', 'last_user_email', 'last_user_phone', 'last_user_whatsapp']
      .forEach(k => localStorage.removeItem(k));
    onRestart();
  };

  /* ─── ÉCRAN CONFIRMÉ ─── */
  if (booked) {
    return (
      <ScreenWrapper>
        <div className="animate-scale-in" style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(20,184,166,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6', border: '2px solid rgba(20,184,166,0.2)' }}>
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(20,184,166,0.1)', color: '#14B8A6', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '999px', marginBottom: '12px' }}>
              Rendez-vous confirmé
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: 1.2 }}>
              Merci pour votre confiance !
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>
              Un de nos experts vous contactera directement au numéro indiqué pour approfondir vos résultats de diagnostic.
            </p>
          </div>
          <Button variant="primary" onClick={handleFinish} style={{ height: '48px', paddingLeft: '32px', paddingRight: '32px', borderRadius: '12px', fontWeight: 700 }}>
            Retourner à l'accueil
          </Button>
        </div>
      </ScreenWrapper>
    );
  }

  /* ─── ÉCRAN PRINCIPAL ─── */
  return (
    <ScreenWrapper>
      <div className="animate-scale-in" style={{ maxWidth: '560px', margin: '0 auto', padding: isMobile ? '20px 12px' : '40px 20px', textAlign: 'center' }}>
        {/* Hero */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(14,116,144,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6', margin: '0 auto 20px', border: '1.5px solid rgba(20,184,166,0.2)' }}>
            <Award size={38} strokeWidth={1.5} />
          </div>
          <span style={{ display: 'inline-block', background: 'rgba(20,184,166,0.1)', color: '#14B8A6', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '999px', marginBottom: '14px' }}>
            Parcours terminé
          </span>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Votre diagnostic est prêt !
          </h1>
          <p style={{ fontSize: '0.93rem', color: '#64748B', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
            Votre rapport détaillé a été généré. Pour l'analyser avec un expert et construire votre plan d'action, planifiez un échange dès maintenant.
          </p>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            style={{ height: '52px', justifyContent: 'center', gap: '10px', borderRadius: '14px', fontWeight: 700, fontSize: '0.97rem', boxShadow: '0 8px 24px rgba(20,184,166,0.25)' }}
          >
            <Calendar size={19} />
            Prendre rendez-vous avec un expert
          </Button>
          <button
            type="button"
            onClick={handleFinish}
            style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', padding: '8px', textDecoration: 'underline', fontFamily: 'inherit' }}
          >
            Retourner à l'accueil sans rendez-vous
          </button>
        </div>
      </div>

      {/* ─── MODAL CALENDRIER ─── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,14,36,0.55)', backdropFilter: 'blur(6px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowModal(false)} />

          <div className="animate-scale-in" style={{
            position: 'relative', zIndex: 1101,
            background: '#FFFFFF', borderRadius: '24px',
            padding: isMobile ? '20px 16px 24px' : '28px 28px 32px',
            width: '100%', maxWidth: '500px',
            boxShadow: '0 32px 64px rgba(7,14,36,0.2)',
            maxHeight: '92vh', overflowY: 'auto',
          }}>
            {/* Header modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6' }}>
                  <Calendar size={19} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Choisir un créneau</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>Séances de 30 min avec un expert</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                <X size={16} />
              </button>
            </div>

            {/* ── ÉTAPE 1 : Choisir un jour ── */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                1 · Choisissez un jour
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  disabled={dayOffset === 0}
                  onClick={() => { setDayOffset(p => Math.max(0, p - daysPerPage)); }}
                  style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F1F5F9', border: 'none', cursor: dayOffset === 0 ? 'default' : 'pointer', color: dayOffset === 0 ? '#CBD5E1' : '#475569', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronLeft size={15} />
                </button>

                <div style={{ display: 'flex', gap: '6px', flex: 1, overflow: 'hidden' }}>
                  {visibleDays.map((day, i) => {
                    const globalIdx = dayOffset + i;
                    const isSelected = selectedDayIndex === globalIdx;
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => { setSelectedDayIndex(globalIdx); setSelectedTime(null); }}
                        style={{
                          flex: 1,
                          padding: '8px 4px',
                          borderRadius: '12px',
                          border: '1.5px solid',
                          borderColor: isSelected ? '#14B8A6' : '#E2E8F0',
                          background: isSelected ? 'linear-gradient(135deg, #14B8A6, #0E7490)' : '#FAFAFA',
                          color: isSelected ? '#FFFFFF' : '#334155',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.18s ease',
                          boxShadow: isSelected ? '0 4px 12px rgba(20,184,166,0.3)' : 'none',
                          fontFamily: 'inherit',
                        }}
                      >
                        <div style={{ fontSize: '0.68rem', fontWeight: 600, opacity: isSelected ? 0.85 : 0.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {DAYS_FR[day.getDay()].toUpperCase()}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.1, margin: '3px 0 1px' }}>
                          {day.getDate()}
                        </div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: isSelected ? 0.85 : 0.55 }}>
                          {MONTHS_FR[day.getMonth()].slice(0, 4).toUpperCase()}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={dayOffset + daysPerPage >= WORKDAYS.length}
                  onClick={() => { setDayOffset(p => Math.min(WORKDAYS.length - daysPerPage, p + daysPerPage)); }}
                  style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F1F5F9', border: 'none', cursor: dayOffset + daysPerPage >= WORKDAYS.length ? 'default' : 'pointer', color: dayOffset + daysPerPage >= WORKDAYS.length ? '#CBD5E1' : '#475569', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* ── ÉTAPE 2 : Choisir une heure ── */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                  2 · Choisissez une heure
                </p>
                {selectedDay && (
                  <span style={{ fontSize: '0.75rem', color: '#14B8A6', fontWeight: 600 }}>
                    — {formatDayFull(selectedDay)}
                  </span>
                )}
              </div>

              {/* Matin */}
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={11} /> Matin (09:00 – 12:00)
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))', gap: '7px' }}>
                  {TIME_SLOTS.filter(s => parseInt(s.time.split(':')[0]) < 12).map(slot => {
                    const isSel = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        style={{
                          padding: '10px 4px',
                          borderRadius: '10px',
                          border: '1.5px solid',
                          borderColor: isSel ? '#14B8A6' : '#E2E8F0',
                          background: isSel ? 'linear-gradient(135deg, #14B8A6, #0E7490)' : '#FAFAFA',
                          color: isSel ? '#FFFFFF' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s',
                          boxShadow: isSel ? '0 4px 10px rgba(20,184,166,0.3)' : 'none',
                          fontFamily: 'inherit',
                        }}
                      >
                        {slot.time}
                        {isSel && (
                          <div style={{ fontSize: '0.6rem', opacity: 0.85, marginTop: '2px' }}>
                            → {slot.endTime}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Après-midi */}
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={11} /> Après-midi (14:00 – 18:00)
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))', gap: '7px' }}>
                  {TIME_SLOTS.filter(s => parseInt(s.time.split(':')[0]) >= 14).map(slot => {
                    const isSel = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        style={{
                          padding: '10px 4px',
                          borderRadius: '10px',
                          border: '1.5px solid',
                          borderColor: isSel ? '#14B8A6' : '#E2E8F0',
                          background: isSel ? 'linear-gradient(135deg, #14B8A6, #0E7490)' : '#FAFAFA',
                          color: isSel ? '#FFFFFF' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s',
                          boxShadow: isSel ? '0 4px 10px rgba(20,184,166,0.3)' : 'none',
                          fontFamily: 'inherit',
                        }}
                      >
                        {slot.time}
                        {isSel && (
                          <div style={{ fontSize: '0.6rem', opacity: 0.85, marginTop: '2px' }}>
                            → {slot.endTime}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Résumé sélection ── */}
            {selectedTime && selectedDay && (
              <div style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(14,116,144,0.04))', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CheckCircle2 size={18} style={{ color: '#14B8A6', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                    {formatDayFull(selectedDay)} à {selectedTime}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B' }}>
                    Séance de 30 min · Se termine à {selectedSlotObj?.endTime}
                  </p>
                </div>
              </div>
            )}

            {/* ── Boutons ── */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center', height: '44px', borderRadius: '12px' }}>
                Annuler
              </Button>
              <Button
                variant="primary"
                disabled={!selectedTime || !selectedDay || isSubmitting}
                onClick={handleBookAppointment}
                style={{ flex: 2, justifyContent: 'center', height: '44px', borderRadius: '12px', fontWeight: 700 }}
              >
                {isSubmitting ? 'Confirmation...' : 'Confirmer le rendez-vous'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
};
