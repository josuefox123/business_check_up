import React from 'react';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';

export const NotificationsModule = ({ notifications, onMarkRead, onDelete }) => {
  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Notifications système</h1>
        <p className="admin-page-sub">Gérez et suivez les alertes de l'application</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Toutes les notifications ({notifications.length})</h2>
        </div>
        <div style={{ padding: '20px' }}>
          {notifications.map(n => (
            <div 
              key={n.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px', 
                padding: '16px', 
                borderBottom: '1px solid var(--slate-100)',
                background: n.read ? 'transparent' : 'var(--color-blue-light)',
                borderRadius: '8px',
                marginBottom: '10px'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {n.type === 'danger' ? <AlertTriangle size={18} color="var(--color-danger)" /> : <Info size={18} color="var(--color-blue)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{n.title}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '4px 0 0 0' }}>{n.message}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!n.read && (
                  <button className="btn btn-ghost btn-sm" onClick={() => onMarkRead(n.id)} style={{ color: 'var(--color-blue)' }}>lu</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => onDelete(n.id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p style={{ color: 'var(--slate-400)', textAlign: 'center', padding: '40px' }}>Aucune notification</p>
          )}
        </div>
      </div>
    </div>
  );
};
