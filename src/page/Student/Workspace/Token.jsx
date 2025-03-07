import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/JWTContext";
import axios from "axios";
import RequestModal from "../../../component/Admin/RequestModal";
import { GiToken } from "react-icons/gi";
import { useTranslation } from 'react-i18next';

const TokenWorkspace = () => {
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
                    const response = await axios.get(`http://localhost:5000/api/user/${user.id}`, {
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

    const balanceToken = (totalToken, usedToken) => {
        return totalToken - usedToken;
    }

    const handleAddRequest = () => {
        setIsRequestModalOpen(false);
    };

    if (!ready) return null;

    return (
        <div className="max-w-screen-lg mx-0 lg:mx-10 mt-5 lg:mt-10">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200/90 mb-4">{t("token.title")}</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => setIsRequestModalOpen(true)}
                >
                    <GiToken className="w-6 h-6 inline-block mr-1" />
                    <span className="text-sm">{t("token.request")}</span>
                </button>
            </div>


            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 ">
                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("token.widget_total")}</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo?.totalToken ?? "Failed to get Token"}
                            </p>

                        </div>
                        {/* <Wallet className='w-20 h-20 text-blue-500' /> */}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("token.widget_used")}</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo?.usedToken ?? "Failed to get Token"}
                            </p>

                        </div>
                        {/* <History className='w-20 h-20 text-gray-400' /> */}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("token.widget_balance")}</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo
                                    ? balanceToken(userInfo.totalToken ?? 0, userInfo.usedToken ?? 0)
                                    : "Failed to get Token"}
                            </p>

                        </div>
                        {/* <Network className='w-20 h-20 text-blue-500' /> */}
                    </div>
                </div>
            )}

            {isRequestModalOpen && userInfo && (
                <RequestModal
                    title={t("token.request")}
                    type="token"
                    onClose={() => setIsRequestModalOpen(false)}
                    onSubmit={handleAddRequest}
                    initialValues={userInfo}
                    subdomain={subdomain}
                />
            )}


        </div>
    );
};

export default TokenWorkspace;
