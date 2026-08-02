import { useState, useEffect } from 'react';
import { settingsApi } from '../utils/api';

let cachedSettings = null;
const listeners = new Set();

export const useSettings = () => {
  const [settings, setSettings] = useState(cachedSettings || {});

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      return;
    }
    settingsApi.get()
      .then(data => {
        cachedSettings = data;
        listeners.forEach(fn => fn(data));
      })
      .catch(() => {});

    const handler = (data) => setSettings(data);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  return {
    socialFacebook: settings.socialFacebook || '',
    socialInstagram: settings.socialInstagram || '',
    socialLinkedin: settings.socialLinkedin || '',
    socialTwitter: settings.socialTwitter || '',
  };
};
