import { useState, useEffect } from 'react';
import { STORAGE_KEYS, clearDiagnosticStorage } from '../constants/storageKeys.js';

const SESSION_EXPIRY_DAYS = 7;

export function useSessionPersist() {
  const [clientIp, setClientIp] = useState('');

  // Fetch client IP on mount with short timeout to prevent slow network blocks
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    fetch('https://api.ipify.org?format=json', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setClientIp(data.ip);
        }
      })
      .catch(() => {
        // Silently ignore external IP fetch timeouts / network blockings
      })
      .finally(() => clearTimeout(timeoutId));

    return () => controller.abort();
  }, []);

  const saveState = (stateData) => {
    try {
      const stateToSave = {
        ...stateData,
        clientIp: stateData?.clientIp || clientIp,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DIAG_STATE, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving diagnostic state to localStorage:', e);
    }
  };

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DIAG_STATE);
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
    clearDiagnosticStorage();
  };

  return {
    saveState,
    loadState,
    clearState,
    clientIp
  };
}
