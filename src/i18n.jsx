import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem("language") || "en",
        fallbackLng: "en",
        supportedLngs: ["en", "malay"],
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        ns: ["dashboard", "workspace", "sidebar", "settings", "panel", "common"],
        defaultNS: "dashboard",
        backend: {
            loadPath: "/locales/{{lng}}/{{lng}}-{{ns}}.json",
            allowMultiLoading: true
        },
    });

export default i18n;
