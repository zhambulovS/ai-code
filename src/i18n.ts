
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationEN from './locales/en.json';
import translationKK from './locales/kk.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  kk: {
    translation: translationKK
  }
};

// Get user's preferred language from local storage or use browser language
const storedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.split('-')[0];
const defaultLanguage = (storedLanguage && ['en', 'kk'].includes(storedLanguage)) ? storedLanguage : 
                      (['en', 'kk'].includes(browserLanguage)) ? browserLanguage : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en', // Use English if translation is missing
    keySeparator: '.',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false
    }
  });

// Set html lang attribute
document.documentElement.lang = defaultLanguage;
document.documentElement.dir = defaultLanguage === 'kk' ? 'ltr' : 'ltr'; // Add RTL support if needed in future

// Add a language change listener to update localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'kk' ? 'ltr' : 'ltr'; // Add RTL support if needed in future
});

export default i18n;
