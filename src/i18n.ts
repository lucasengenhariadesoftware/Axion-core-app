import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ptJSON from './locales/pt.json';
import enJSON from './locales/en.json';
import deJSON from './locales/de.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            pt: { translation: ptJSON },
            en: { translation: enJSON },
            de: { translation: deJSON },
        },
        fallbackLng: 'pt', // Default to Portuguese if language not found
        interpolation: {
            escapeValue: false, // React already safe from XSS
        },
        detection: {
            order: ['navigator', 'htmlTag', 'localStorage'],
            caches: ['localStorage'],
        },
    });

export default i18n;
