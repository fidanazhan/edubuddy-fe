import { useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/JWTContext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Toast from '../../../component/Toast/Toast';
import api from '../../../api/axios'

const ThemeSettings = () => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const { t, ready } = useTranslation("settings");
    const [toast, setToast] = useState(null);

    const handleToggleTheme = (theme) => {
        postNewTheme(theme);
    };

    const postNewTheme = async (theme) => {
        const token = localStorage.getItem("accessToken");
        const subdomain = window.location.hostname.split(".")[0];
        try {
            const response = await api.put(`/api/user/${user.id}/theme`, { theme }, {
                headers: {
                    "x-tenant": subdomain,
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data.user.theme) {
                document.documentElement.classList.remove("light", "dark");
                document.documentElement.classList.add(response.data.user.theme);
                localStorage.setItem("theme", response.data.theme);
                setTheme(response.data.user.theme);
            }

            if (response.status === 201 || response.status === 200) {
                showToast("Theme changed successfully!", "bg-green-500", "success");
            }

        } catch (error) {
            console.error("Error changing theme:", error);
            showToast("Theme changed failed!", "bg-red-500", "error");
        }
    };

    const showToast = (message, color, status) => {
        setToast({ message, color, status });
        setTimeout(() => setToast(null), 3000);
    };

    if (!ready) return null;

    return (
        <>
            <h2 className="text-2xl lg:text-lg font-bold mb-6 lg:mb-4">{t("settings.theme.title")}</h2>
            <div className="flex items-center gap-4 ">
                <button
                    onClick={() => handleToggleTheme("light")}
                    className={`flex px-4 py-2 rounded-lg ${theme === "light" ? "bg-blue-500 dark:bg-blue-800 text-white" : "bg-gray-200"} dark:bg-gray-900 dark:text-white`}
                >
                    <MdLightMode className="w-7 h-7 lg:w-5 lg:h-5 mr-2" />
                    <span className="text-xl lg:text-base">{t("settings.theme.light")}</span>
                </button>
                <button
                    onClick={() => handleToggleTheme("dark")}
                    className={`flex px-4 py-2 rounded-lg ${theme === "dark" ? "bg-blue-500 dark:bg-blue-800 text-white" : "bg-gray-200"}`}
                >
                    <MdDarkMode className="w-7 h-7 lg:w-5 lg:h-5 mr-2" />
                    <span className="text-xl lg:text-base">{t("settings.theme.dark")}</span>
                </button>
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

export default ThemeSettings;
