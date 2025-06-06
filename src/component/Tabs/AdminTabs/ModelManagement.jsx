import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import api from '../../../api/axios'

const ModelManagement = () => {
    const [config, setConfig] = useState({
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9,
        topK: 0.9,
    });
    const subdomain = window.location.hostname.split(".")[0];
    const { t, ready } = useTranslation(["admin", "common"]);


    useEffect(() => {
        api.get("/api/modelConfig/tenant", {
            headers: { "x-tenant": subdomain },
        })
            .then(response => setConfig(response.data))
            .catch(error => console.error("Error fetching all configs:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleSave = () => {
        api.put("/api/modelConfig/", config, {
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
            <h1 className="text-xl font-semibold">{t("admin:system.model.title")}</h1>
            <div className="w-full mx-auto mt-8 p-6">
                <form onSubmit={handleSave}>
                    <label className="block mb-2">
                        {t("admin:system.model.temperature")}
                        <input 
                            type="number" 
                            name="temperature" 
                            value={config.temperature} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mt-1 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 appearance-none" 
                        />
                    </label>
                    <label className="block mb-2">
                        {t("admin:system.model.max_output")}
                        <input 
                            type="number" 
                            name="maxOutputTokens" 
                            value={config.maxOutputTokens} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mt-1 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 appearance-none" 
                        />
                    </label>
                    <label className="block mb-2">
                        Top-P
                        <input 
                            type="number" 
                            name="topP" 
                            value={config.topP} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mt-1 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 appearance-none" 
                        />
                    </label>
                    <label className="block mb-2">
                        Top-K
                        <input 
                            type="number" 
                            name="topK" 
                            value={config.topK} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mt-1 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300 appearance-none" 
                        />
                    </label>

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

export default ModelManagement;