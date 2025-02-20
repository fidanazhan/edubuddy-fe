import { useState, useEffect } from "react";
import axios from "axios";

const AuthenticationManagement = () => {
    const [config, setConfig] = useState({
        accessTokenTTL: 15,
        refreshTokenTTL: 1440,
        maxFailedLoginAttempts: 5,
        googleLogin: false,
        microsoftLogin: false,
    });
    const subdomain = window.location.hostname.split(".")[0];

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

    return (
        // max-w-lg
        <div className="p-6 mb-4">
            <h1 className="text-xl font-semibold">Authentication Configuration</h1>
            <div className="w-full mx-auto mt-8 p-6 bg-gray-50 shadow-lg rounded-lg">
                <form onSubmit={handleSave}>
                    <label className="block mb-2">
                        Access Token TTL (minutes)
                        <input type="number" name="accessTokenTTL" value={config.accessTokenTTL} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block mb-2">
                        Refresh Token TTL (minutes)
                        <input type="number" name="refreshTokenTTL" value={config.refreshTokenTTL} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block mb-2">
                        Max Failed Login Attempts
                        <input type="number" name="maxFailedLoginAttempts" value={config.maxFailedLoginAttempts} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                    </label>

                    <div className="flex w-full space-x-2 justify-around mt-4">
                        <div className={`flex justify-center items-center w-1/2 max-w-lg mb-4 border border-gray-300 rounded-lg p-2 py-4 transition-colors duration-300 ${config.googleLogin ? 'bg-green-100 border-green-300' : ''}`}> {/* Conditional background color */}
                            <div className="flex items-center">
                                <span>
                                    Google Login
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer ml-3">
                                    <input
                                        type="checkbox"
                                        name="googleLogin"
                                        checked={config.googleLogin}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${config.googleLogin ? "bg-green-200" : "bg-gray-300"}`}>
                                        <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${config.googleLogin ? "translate-x-6 bg-green-700" : "translate-x-0 bg-white"}`}>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className={`flex justify-center items-center w-1/2 max-w-lg mb-4 border border-gray-300 rounded-lg p-2 py-4 transition-colors duration-300 ${config.microsoftLogin ? 'bg-green-100 border-green-300' : ''}`}> {/* Conditional background color */}
                            <div className="flex items-center">
                                <span>
                                    Microsoft Login
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer ml-3">
                                    <input
                                        type="checkbox"
                                        name="microsoftLogin"
                                        checked={config.microsoftLogin}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${config.microsoftLogin ? "bg-green-200" : "bg-gray-300"}`}>
                                        <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${config.microsoftLogin ? "translate-x-6 bg-green-700" : "translate-x-0 bg-white"}`}>
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
                        Submit
                    </button>
                </form>


            </div>
        </div>

    );
}

export default AuthenticationManagement;