import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bc_diag_state';
const SESSION_EXPIRY_DAYS = 7;

export function useSessionPersist() {
  const [clientIp, setClientIp] = useState('');

  // Fetch client IP on mount
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setClientIp(data.ip);
        }
      })
      .catch(err => {
        console.warn('Could not fetch client IP for session fingerprinting:', err);
      });
  }, []);

  const saveState = (stateData) => {
    try {
      const stateToSave = {
        ...stateData,
        clientIp: stateData?.clientIp || clientIp,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving diagnostic state to localStorage:', e);
    }
  };

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.savedAt) return null;

      // Check age
      const savedDate = new Date(parsed.savedAt);
      const diffTime = Math.abs(new Date() - savedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > SESSION_EXPIRY_DAYS) {
        clearState();
        return null;
      }

      return parsed;
    } catch (e) {
      console.error('Error loading diagnostic state from localStorage:', e);
      return null;
    }
  };

  const clearState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('bc_session_id'); // Also clear backend session ID if diagnostic is cleared/finished
    } catch (e) {
      console.error('Error clearing diagnostic state:', e);
    }
  };

  return {
    saveState,
    loadState,
    clearState,
    clientIp
  };
}
