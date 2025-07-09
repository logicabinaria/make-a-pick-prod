import Cookies from 'js-cookie';

// Language preference
export const getLanguagePreference = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || Cookies.get('language') || null;
  }
  return null;
};

export const setLanguagePreference = (language: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language);
    Cookies.set('language', language, { expires: 365 });
  }
};

// Privacy consent
export const getPrivacyConsent = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('privacyConsent') === 'true' || Cookies.get('privacyConsent') === 'true';
  }
  return false;
};

export const setPrivacyConsent = (consent: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('privacyConsent', consent.toString());
    Cookies.set('privacyConsent', consent.toString(), { expires: 365 });
  }
};