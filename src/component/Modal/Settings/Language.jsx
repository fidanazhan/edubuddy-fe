import { useState } from "react";

const LanguageSettings = () => {
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <>
            <h2 className="text-lg font-bold mb-4">Language Settings</h2>
            <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full p-2 border rounded-lg dark:text-black/80"
            >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
            </select>
        </>
    );
};

export default LanguageSettings;
