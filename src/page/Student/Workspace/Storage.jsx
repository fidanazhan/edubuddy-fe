import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/JWTContext";
import axios from "axios";
import RequestModal from "../../../component/Admin/RequestModal";
import { FaDatabase } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import api from '../../../api/axios'

const StorageWorkspace = () => {
    const [loading, setLoading] = useState("")
    const { user } = useAuth();
    const [userInfo, setUser] = useState(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const subdomain = window.location.hostname.split(".")[0];
    const { t, ready } = useTranslation("workspace");

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        setLoading(true);
        try {
            setTimeout(async () => {
                try {
                    const response = await api.get(`/api/user/${user.id}`, {
                        headers: {
                            "x-tenant": subdomain
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    }

    const balanceStorage = (totalStorage, usedStorage) => {
        return totalStorage - usedStorage;
    }

    const handleAddRequest = () => {
        setIsRequestModalOpen(false);
    };

    if (!ready) return null;

    return (
        <div className="max-w-screen-lg mx-0 lg:mx-10 mt-5 lg:mt-10">
            <div className="flex justify-between items-center bg-white dark:bg-gray-700 px-4 py-3 shadow-md rounded-lg mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {t("storage.title")}
                </h2>
                <button
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                    onClick={() => setIsRequestModalOpen(true)}
                >
                    <FaDatabase className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{t("storage.request")}</span>
                </button>
            </div>



            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("storage.widget_total")}</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo?.totalStorage ?? "Failed to get Storage"}
                            </p>

                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("storage.widget_used")}</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo?.usedStorage ?? "Failed to get Storage"}
                            </p>

                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("storage.widget_balance")}</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo
                                    ? balanceStorage(userInfo.totalStorage ?? 0, userInfo.usedStorage ?? 0)
                                    : "Failed to get Storage"}
                            </p>

                        </div>
                    </div>
                </div>
            )}

            {isRequestModalOpen && userInfo && (
                <RequestModal
                    title={t("storage.request")}
                    type="storage"
                    onClose={() => setIsRequestModalOpen(false)}
                    onSubmit={handleAddRequest}
                    initialValues={userInfo}
                    subdomain={subdomain}
                />
            )}


        </div>
    );
};

export default StorageWorkspace;
