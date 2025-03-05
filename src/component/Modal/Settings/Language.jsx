import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/JWTContext";
import axios from "axios";

const LanguageSettings = () => {
    const { i18n, t, ready } = useTranslation("settings");
    const language = i18n.language; // ✅ Get current language
    const languages = i18n.options.supportedLngs.filter(lng => lng !== "cimode");
    const { user } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || language);

    const handleLanguageChange = (event) => {
        putUserLang(event.target.value);
    };

    const putUserLang = async (lang) => {
        const token = localStorage.getItem("accessToken");
        const subdomain = window.location.hostname.split(".")[0];
        try {
            const response = await axios.put(`http://localhost:5000/api/user/${user.id}/lang`, { lang }, {
                headers: {
                    "x-tenant": subdomain,
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data.user.language) {
                localStorage.setItem("language", response.data.user.language);
                i18n.changeLanguage(response.data.user.language);
                setSelectedLanguage(response.data.user.language);
            }
        } catch (error) {
            console.error("Error posting theme:", error);
        }
    };

    if (!ready) return null;

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">{t("settings.language.title")}</h2>
            <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="w-full p-2 border rounded-lg dark:text-black/80"
            >
                {languages.map((lng) => (
                    <option key={lng} value={lng}>
                        {lng}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSettings;
