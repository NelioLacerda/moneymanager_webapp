import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations/en/global.json";
import pt from "./translations/pt/global.json";

const resources = {
    en: { translation: en },
    pt: { translation: pt },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("i18nextLng") || "en", // idioma inicial
        fallbackLng: "en",
        debug: false,
        interpolation: { escapeValue: false },
        react: { useSuspense: true },
    });

export default i18n;
