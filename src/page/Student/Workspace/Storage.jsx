import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/JWTContext";
import axios from "axios";
import RequestModal from "../../../component/Admin/RequestModal";
import { FaDatabase } from "react-icons/fa";


const StorageWorkspace = () => {
    const [loading, setLoading] = useState("")
    const { user } = useAuth();
    const [userInfo, setUser] = useState(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const subdomain = window.location.hostname.split(".")[0];

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

    const balanceStorage = (totalStorage, usedStorage) => {
        return totalStorage - usedStorage;
    }

    const handleAddRequest = () => {
        setIsRequestModalOpen(false);
    };

    return (
        <div className="max-w-screen-lg mx-0 lg:mx-10 mt-5 lg:mt-10">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Storage Data</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => setIsRequestModalOpen(true)}
                >
                    <FaDatabase className="w-6 h-4 inline-block mr-1" />
                    <span className="text-sm">Request Storage</span>
                </button>
            </div>


            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700">Total Storage</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo?.totalStorage ?? "Failed to get Storage"}
                            </p>

                        </div>
                        {/* <Wallet className='w-20 h-20 text-blue-500' /> */}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700">Storage Used</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo?.usedStorage ?? "Failed to get Storage"}
                            </p>

                        </div>
                        {/* <History className='w-20 h-20 text-gray-400' /> */}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                        <div className=''>
                            <h2 className="text-xl font-semibold text-gray-700">Storage Balance</h2>
                            <p className="text-gray-500 mt-4">
                                {userInfo
                                    ? balanceStorage(userInfo.totalStorage ?? 0, userInfo.usedStorage ?? 0)
                                    : "Failed to get Storage"}
                            </p>

                        </div>
                        {/* <Network className='w-20 h-20 text-blue-500' /> */}
                    </div>
                </div>
            )}

            {isRequestModalOpen && userInfo && (
                <RequestModal
                    title="Request Storage"
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
