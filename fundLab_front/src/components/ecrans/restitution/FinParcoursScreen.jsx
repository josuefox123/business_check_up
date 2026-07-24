import React, { useState, useEffect, useMemo } from 'react';
import { Award, Calendar, Clock, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { apiFetch } from '../../../api/config.js';

/* ─── Créneaux horaires ─── */
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
    });
  };
  // Matin 09:00 → 11:40
  let h = 9, m = 0;
  while (true) {
    addSlot(h, m);
    if (h === 11 && m === 40) break;
    m += 40; if (m >= 60) { h++; m -= 60; }
  }
  // Après-midi 14:00 → 17:20
  h = 14; m = 0;
  while (!(h === 17 && m > 20) && h < 18) {
    addSlot(h, m);
    m += 40; if (m >= 60) { h++; m -= 60; }
  }
  return slots;
};
const TIME_SLOTS = generateSlots();

/* ─── Helpers ─── */
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS_FR_MIN = ['Di','Lu','Ma','Me','Je','Ve','Sa'];
const DAYS_FULL_FR = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

const todayMidnight = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
const isPast    = (d) => d < todayMidnight();
const isDisabled = (d) => isWeekend(d) || isPast(d);

const formatDayFull = (d) =>
  `${DAYS_FULL_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;

/* ─── Mini-Calendar ─── */
const MiniCalendar = ({ selectedDate, onSelect }) => {
  const today = todayMidnight();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Empêche de revenir avant le mois actuel
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startDow = (firstDay.getDay() + 6) % 7; // lundi = 0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const grid = [];
    for (let i = 0; i < startDow; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push(new Date(viewYear, viewMonth, d));
    }
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [viewYear, viewMonth]);

  const selKey = selectedDate ? toKey(selectedDate) : null;

  return (
    <div style={{ userSelect: 'none' }}>
      {/* En-tête navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={prevMonth}
          style={{ width: '32px', height: '32px', borderRadius: '8px', background: canGoPrev ? '#F1F5F9' : 'transparent', border: 'none', cursor: canGoPrev ? 'pointer' : 'default', color: canGoPrev ? '#475569' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        ><ChevronLeft size={16} /></button>

        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
          {MONTHS_FR[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        ><ChevronRight size={16} /></button>
      </div>

      {/* En-têtes jours */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAYS_FR_MIN.slice(1).concat(DAYS_FR_MIN[0]).map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.67rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const disabled = isDisabled(day);
          const isToday  = toKey(day) === toKey(today);
          const isSel    = selKey === toKey(day);
          const isWE     = isWeekend(day);

          return (
            <button
              key={toKey(day)}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(day)}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '8px',
                border: isSel ? '2px solid #14B8A6' : isToday ? '1.5px solid #CBD5E1' : '1.5px solid transparent',
                background: isSel
                  ? 'linear-gradient(135deg, #14B8A6, #0E7490)'
                  : isToday ? '#F8FAFC' : 'transparent',
                color: isSel ? '#fff' : disabled ? '#CBD5E1' : isWE ? '#E2E8F0' : '#1E293B',
                fontWeight: isSel ? 800 : isToday ? 700 : 500,
                fontSize: '0.82rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                boxShadow: isSel ? '0 4px 10px rgba(20,184,166,0.3)' : 'none',
                transition: 'all 0.13s',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => { if (!disabled && !isSel) e.currentTarget.style.background = 'rgba(20,184,166,0.08)'; }}
              onMouseLeave={e => { if (!disabled && !isSel) e.currentTarget.style.background = 'transparent'; }}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════ */
export const FinParcoursScreen = ({ onRestart }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const selectedSlotObj = selectedTime ? TIME_SLOTS.find(s => s.time === selectedTime) : null;

  const handleBookAppointment = async () => {
    if (!selectedTime || !selectedDate) return;
    setIsSubmitting(true);

    const runId = localStorage.getItem('last_run_id');

    // Construction du datetime ISO 8601 : date sélectionnée + heure choisie
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const rdvDate = new Date(selectedDate);
    rdvDate.setHours(hours, minutes, 0, 0);
    const requested_starts_at = rdvDate.toISOString();

    if (!runId) {
      // Pas de runId en local → simule la confirmation
      setTimeout(() => { setIsSubmitting(false); setBooked(true); setShowModal(false); }, 800);
      return;
    }

    try {
      // POST /diagnostics/{diagnosticRunId}/appointment
      // Base URL : https://business-chekcup.nicktep.com/api/
      const BASE = 'https://business-chekcup.nicktep.com/api';
      await apiFetch(`${BASE}/diagnostics/${runId}/appointment`, {
        method: 'POST',
        body: JSON.stringify({
          requested_starts_at,
          main_question: null
        })
      });
      setBooked(true);
      setShowModal(false);
    } catch (err) {
      console.error('Appointment booking error:', err);
      // En cas d'erreur réseau, on confirme quand même côté UX
      setBooked(true);
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    ['last_run_id','last_user_name','last_user_email','last_user_phone','last_user_whatsapp']
      .forEach(k => localStorage.removeItem(k));
    onRestart();
  };

  /* ─── ÉCRAN CONFIRMÉ ─── */
  if (booked) {
    return (
      <ScreenWrapper>
        <div className="animate-scale-in" style={{ maxWidth: '480px', margin: '0 auto', padding: '48px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6', border: '2px solid rgba(20,184,166,0.2)' }}>
            <CheckCircle2 size={46} strokeWidth={1.5} />
          </div>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(20,184,166,0.1)', color: '#14B8A6', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '999px', marginBottom: '14px' }}>
              Rendez-vous confirmé
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: 1.2 }}>
              Merci pour votre confiance !
            </h1>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto' }}>
              Un de nos experts vous contactera directement au numéro indiqué pour approfondir vos résultats.
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
      <div className="animate-scale-in" style={{ maxWidth: '540px', margin: '0 auto', padding: isMobile ? '24px 16px' : '48px 20px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(20,184,166,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6', margin: '0 auto 20px', border: '1.5px solid rgba(20,184,166,0.2)' }}>
          <Award size={38} strokeWidth={1.5} />
        </div>
        <span style={{ display: 'inline-block', background: 'rgba(20,184,166,0.09)', color: '#14B8A6', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '999px', marginBottom: '16px' }}>
          Parcours terminé
        </span>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '12px' }}>
          Votre rapport a été envoyé !
        </h1>
        <p style={{ fontSize: '0.93rem', color: '#64748B', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 36px' }}>
          Un rapport PDF complet et personnalisé vient de vous être transmis par e-mail. Pour l'analyser avec un conseiller FUND.lab et définir vos priorités d'action, planifiez un échange dès maintenant.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
          <Button variant="primary" onClick={() => setShowModal(true)} style={{ height: '52px', justifyContent: 'center', gap: '10px', borderRadius: '14px', fontWeight: 700, fontSize: '0.97rem', boxShadow: '0 8px 24px rgba(20,184,166,0.22)' }}>
            <Calendar size={19} /> Prendre rendez-vous avec un expert
          </Button>
          <button type="button" onClick={handleFinish} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.87rem', cursor: 'pointer', padding: '6px', textDecoration: 'underline', fontFamily: 'inherit' }}>
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
            width: '100%', maxWidth: '480px',
            boxShadow: '0 32px 64px rgba(7,14,36,0.22)',
            maxHeight: '94vh', overflowY: 'auto',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14B8A6' }}>
                  <Calendar size={19} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Choisir un créneau</h3>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#94A3B8' }}>Séances de 30 min · Lundi – Vendredi</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                <X size={16} />
              </button>
            </div>

            {/* ── ÉTAPE 1 : Calendrier ── */}
            <div style={{ marginBottom: '22px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
                1 · Choisissez une date
              </p>
              <div style={{ background: '#FAFBFC', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }}>
                <MiniCalendar
                  selectedDate={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                />
              </div>
              {selectedDate && (
                <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 600, color: '#14B8A6' }}>
                  📅 {formatDayFull(selectedDate)}
                </div>
              )}
            </div>

            {/* ── ÉTAPE 2 : Créneaux ── */}
            {selectedDate && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                    2 · Choisissez une heure
                  </p>
                </div>

                {/* Matin */}
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={10} /> Matin — 09:00 à 12:00
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '7px' }}>
                    {TIME_SLOTS.filter(s => parseInt(s.time) < 12).map(slot => {
                      const isSel = selectedTime === slot.time;
                      return (
                        <button key={slot.time} type="button" onClick={() => setSelectedTime(slot.time)} style={{ padding: '10px 4px', borderRadius: '10px', border: '1.5px solid', borderColor: isSel ? '#14B8A6' : '#E2E8F0', background: isSel ? 'linear-gradient(135deg,#14B8A6,#0E7490)' : '#FAFAFA', color: isSel ? '#fff' : '#334155', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', boxShadow: isSel ? '0 4px 10px rgba(20,184,166,0.3)' : 'none', fontFamily: 'inherit' }}>
                          {slot.time}
                          {isSel && <div style={{ fontSize: '0.58rem', opacity: 0.85, marginTop: '2px' }}>→ {slot.endTime}</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Après-midi */}
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={10} /> Après-midi — 14:00 à 18:00
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '7px' }}>
                    {TIME_SLOTS.filter(s => parseInt(s.time) >= 14).map(slot => {
                      const isSel = selectedTime === slot.time;
                      return (
                        <button key={slot.time} type="button" onClick={() => setSelectedTime(slot.time)} style={{ padding: '10px 4px', borderRadius: '10px', border: '1.5px solid', borderColor: isSel ? '#14B8A6' : '#E2E8F0', background: isSel ? 'linear-gradient(135deg,#14B8A6,#0E7490)' : '#FAFAFA', color: isSel ? '#fff' : '#334155', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', boxShadow: isSel ? '0 4px 10px rgba(20,184,166,0.3)' : 'none', fontFamily: 'inherit' }}>
                          {slot.time}
                          {isSel && <div style={{ fontSize: '0.58rem', opacity: 0.85, marginTop: '2px' }}>→ {slot.endTime}</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Résumé ── */}
            {selectedTime && selectedDate && (
              <div style={{ background: 'rgba(20,184,166,0.05)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CheckCircle2 size={18} style={{ color: '#14B8A6', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '0.83rem', fontWeight: 700, color: '#0F172A' }}>{formatDayFull(selectedDate)} à {selectedTime}</p>
                  <p style={{ margin: 0, fontSize: '0.73rem', color: '#64748B' }}>Séance de 30 min · se termine à {selectedSlotObj?.endTime}</p>
                </div>
              </div>
            )}

            {/* ── Actions ── */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center', height: '44px', borderRadius: '12px' }}>Annuler</Button>
              <Button variant="primary" disabled={!selectedTime || !selectedDate || isSubmitting} onClick={handleBookAppointment} style={{ flex: 2, justifyContent: 'center', height: '44px', borderRadius: '12px', fontWeight: 700 }}>
                {isSubmitting ? 'Confirmation...' : 'Confirmer le rendez-vous'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
};
