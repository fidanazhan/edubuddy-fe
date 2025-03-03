// import { useState, useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/JWTContext";
import axios from "axios";

const ThemeSettings = () => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();

    const handleToggleTheme = (theme) => {
        postNewTheme(theme);
    };

    const postNewTheme = async (theme) => {
        const token = localStorage.getItem("accessToken");
        const subdomain = window.location.hostname.split(".")[0];
        try {
            const response = await axios.put(`http://localhost:5000/api/user/${user.id}/theme`, { theme }, {
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
        } catch (error) {
            console.error("Error posting theme:", error);
        }
    };

    return (
        <>
            <h2 className="text-lg font-bold mb-4">Theme Settings</h2>
            <div className="flex items-center gap-4 ">
                <button
                    onClick={() => handleToggleTheme("light")}
                    className={`flex px-4 py-2 rounded-lg ${theme === "light" ? "bg-blue-500 dark:bg-blue-800 text-white" : "bg-gray-200"} dark:bg-gray-900 dark:text-white`}
                >
                    <MdLightMode className="w-5 h-5 mr-2" />
                    <span>Light Mode</span>
                </button>
                <button
                    onClick={() => handleToggleTheme("dark")}
                    className={`flex px-4 py-2 rounded-lg ${theme === "dark" ? "bg-blue-500 dark:bg-blue-800 text-white" : "bg-gray-200"}`}
                >
                    <MdDarkMode className="w-5 h-5 mr-2" />
                    <span>Dark Mode</span>
                </button>
            </div>
        </>
    );
};

export default ThemeSettings;
