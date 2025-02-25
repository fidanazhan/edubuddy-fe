import { useState, useEffect } from "react";

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
                    className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Light Mode
                </button>
                <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 rounded-lg ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Dark Mode
                </button>
            </div>
        </>
    );
};

export default ThemeSettings;
