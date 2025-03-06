import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const AuthenticationManagement = () => {
    const [config, setConfig] = useState({
        accessTokenTTL: "",
        refreshTokenTTL: "",
        maxFailedLoginAttempts: "",
        googleLogin: null,
        microsoftLogin: null,
    });
    const subdomain = window.location.hostname.split(".")[0];
    const { t, ready } = useTranslation(["admin", "common"]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/config/tenant", {
            headers: { "x-tenant": subdomain },
        })
            .then(response => setConfig(response.data))
            .catch(error => console.error("Error fetching all configs:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : name === "name" ? value : Number(value),
        }));
    };

    const handleSave = () => {
        axios.put("http://localhost:5000/api/config/", config, {
            headers: { "x-tenant": subdomain },
        })
            .then(() => {
                alert("Configuration created successfully!");
            })
            .catch(error => alert("Error creating config: " + error.message));
    };

    if (!ready) return null;

    return (
        // max-w-lg
        <div className="p-6 mb-4">
            <h1 className="text-xl font-semibold">{t("admin:system.authentication.title")}</h1>
            <div className="w-full mx-auto mt-8 p-6 bg-gray-50 shadow-lg rounded-lg">
                <form onSubmit={handleSave}>
                    <label className="block mb-2">
                        {t("admin:system.authentication.access_token")}
                        <input 
                            type="number" 
                            name="accessTokenTTL" 
                            value={config.accessTokenTTL} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mt-1 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 appearance-none"
                        />
                    </label>
                    <label className="block mb-2">
                        {t("admin:system.authentication.refresh_token")}
                        <input 
                            type="number" 
                            name="refreshTokenTTL" 
                            value={config.refreshTokenTTL} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mt-1 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 appearance-none" 
                        />
                    </label>
                    <label className="block mb-2">
                        {t("admin:system.authentication.max_failed")}
                        <input 
                            type="number" 
                            name="maxFailedLoginAttempts" 
                            value={config.maxFailedLoginAttempts} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mt-1 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 appearance-none"
                        />
                    </label>

                    <div className="flex w-full space-x-2 justify-around mt-4">
                        <div className={`flex justify-center items-center w-1/2 max-w-lg mb-4 border border-gray-600 rounded-lg p-2 py-4 transition-colors duration-300 ${config.googleLogin ? 'bg-green-900 border-green-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                            <div className={`flex items-center  ${config.googleLogin ? 'text-white' : 'text-black dark:text-white '} `}>
                                <span>
                                    {t("admin:system.authentication.google_login")}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer ml-3">
                                    <input
                                        type="checkbox"
                                        name="googleLogin"
                                        checked={config.googleLogin}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${config.googleLogin ? "bg-green-600" : "bg-gray-600"}`}>
                                        <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${config.googleLogin ? "translate-x-6 bg-green-400" : "translate-x-0 bg-gray-200"}`}>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className={`flex justify-center items-center w-1/2 max-w-lg mb-4 border border-gray-600 rounded-lg p-2 py-4 transition-colors duration-300 ${config.microsoftLogin ? 'bg-green-900 border-green-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                            <div className={`flex items-center  ${config.microsoftLogin ? 'text-white' : 'text-black dark:text-white '} `}>
                                <span>
                                    {t("admin:system.authentication.microsoft_login")}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer ml-3">
                                    <input
                                        type="checkbox"
                                        name="microsoftLogin"
                                        checked={config.microsoftLogin}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${config.microsoftLogin ? "bg-green-600" : "bg-gray-600"}`}>
                                        <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${config.microsoftLogin ? "translate-x-6 bg-green-400" : "translate-x-0 bg-gray-200"}`}>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {t("common:button.submit")}
                    </button>
                </form>


            </div>
        </div>

    );
}

export default AuthenticationManagement;