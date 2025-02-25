import { useState, useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeSettings = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <>
            <h2 className="text-lg font-bold mb-4">Theme Settings</h2>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme("light")}
                    className={`flex px-4 py-2 rounded-lg ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    <MdLightMode className="w-5 h-5 mr-2" />
                    <span>Light Mode</span>
                </button>
                <button
                    onClick={() => setTheme("dark")}
                    className={`flex px-4 py-2 rounded-lg ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    <MdDarkMode className="w-5 h-5 mr-2" />
                    <span>Dark Mode</span>
                </button>
            </div>
        </>
    );
};

export default ThemeSettings;
