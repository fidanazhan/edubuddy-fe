import { useState } from "react";
import { useAuth } from "../../../context/JWTContext";
import { useTranslation } from "react-i18next";
import Toast from '../../../component/Toast/Toast';
import api from '../../../api/axios'
import Select from "react-select";

const LanguageSettings = () => {
    const { i18n, t, ready } = useTranslation("settings");
    const language = i18n.language;
    const languages = i18n.options.supportedLngs.filter(lng => lng !== "cimode");
    const { user } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || language);
    const [toast, setToast] = useState(null);

    const handleLanguageChange = async (event) => {
        const newLang = event.target.value;
        await putUserLang(newLang);
    };

    const putUserLang = async (lang) => {
        const token = localStorage.getItem("accessToken");
        const subdomain = window.location.hostname.split(".")[0];
        try {
            const response = await api.put(`/api/user/${user.id}/lang`, { lang }, {
                headers: {
                    "x-tenant": subdomain,
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201 || response.status === 200) {
                showToast("Language changed successfully!", "bg-green-500", "success");
            }
            setTimeout(async () => {
                if (response.data.user.language) {
                    localStorage.setItem("language", response.data.user.language);
                    setSelectedLanguage(response.data.user.language);
                    await i18n.changeLanguage(response.data.user.language);
                }
            }, 1000);

        } catch (error) {
            console.error("Error changing language:", error);
            showToast("Language changed failed!", "bg-red-500", "error");
        }
    };

    const showToast = (message, color, status) => {
        setToast({ message, color, status });
        setTimeout(() => setToast(null), 3000);
    };

    if (!ready) return null;

    return (
        <>
            <h2 className="text-2xl lg:text-lg font-bold mb-6 lg:mb-4">{t("settings.language.title")}</h2>
            <div className="flex items-center gap-4 ">
                <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="w-60 p-2 border rounded-lg dark:text-black/80"
                >
                    {languages.map((lng) => (
                        <option key={lng} value={lng}>
                            {lng}
                        </option>
                    ))}
                </select>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    color={toast.color}
                    status={toast.status}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default LanguageSettings;
