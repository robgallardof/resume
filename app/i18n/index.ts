import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

/**
 * i18next configuration for client-side translations using localStorage.
 */
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng:
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "en"
      : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
