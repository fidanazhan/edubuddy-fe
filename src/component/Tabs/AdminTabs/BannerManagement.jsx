import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { FaSignInAlt, FaTrash, FaUpload } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";  
import { AiOutlineTrademarkCircle } from 'react-icons/ai'
import BannerModal from '../../Admin/BannerModal';
import { IoMdClose } from "react-icons/io";
import api from '../../../api/axios'

const bannerManagement = () => {
    const [loginLogo, setLoginLogo] = useState(null);
    const [banner, setBanner] = useState(null);
    const [dashboardLogo, setDashboardLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(null)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [imageToDelete, setImageToDelete] = useState("");

    const token = localStorage.getItem("accessToken");
    const subdomain = window.location.hostname.split(".")[0];

    useEffect(() => {
        fetchImg();
    }, []);

    const fetchImg = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/config/theme`, {
                headers: { "x-tenant": subdomain },
            });
            if (response.data.loginLogoUrl) {
                setLoginLogo(response.data.loginLogoUrl);
            }
            if (response.data.bannerUrl) {
                setBanner(response.data.bannerUrl);
            }
            if (response.data.dashboardLogoUrl) {
                setDashboardLogo(response.data.dashboardLogoUrl);
            }
        } catch (error) {
            console.error("Error fetching img:", error);
        } finally{
            setLoading(false);
        }
    };


    const triggerModal = (type) => {
        setModalType(type);
        setIsOpen(false);
        setIsModalOpen(true)
    };

    const uploadSuccess = () => {
        fetchImg()
        setIsModalOpen(false);
    };


    // Function to confirm the deletion
    const confirmDelete = async () => {
        // Optimistically update the UI: Remove the image from the state before making the API call
        switch (imageToDelete) {
            case "login banner":
                setLoginLogo(null); // Remove the login logo from the state
                break;
            case "banner":
                setBanner(null); // Remove the banner from the state
                break;
            case "logo":
                setDashboardLogo(null); // Remove the dashboard logo from the state
                break;
            default:
                console.error("Invalid picture type:", imageToDelete);
                setLoading(false);
                return;
        }
    
        setLoading(true); // Set loading state if needed
    
        let apiEndpoint = "";
        switch (imageToDelete) {
            case "login banner":
                apiEndpoint = `/api/config/delete/login-logo`;
                break;
            case "banner":
                apiEndpoint = `/api/config/delete/banner`;
                break;
            case "logo":
                apiEndpoint = `/api/config/delete/dashboard-logo`;
                break;
            default:
                console.error("Invalid picture type:", imageToDelete);
                setLoading(false);
                return;
        }
    
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + apiEndpoint, {
                headers: {
                    "x-tenant": subdomain,
                    "Authorization": `Bearer ${token}`,
                },
                method: "DELETE",
            });
    
            if (response.status == 200) {
                // After successful deletion, you can call fetchImg() to refetch the data if needed
                fetchImg(); 
                setShowConfirmDelete(false); // Close the confirmation modal
            } else {
                const errorResponse = await response.json();
                setError(errorResponse.error || errorResponse.message);
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            // Revert the UI update if there's an error during deletion
            switch (imageToDelete) {
                case "login banner":
                    setLoginLogo(prev => prev); // Revert the login logo
                    break;
                case "banner":
                    setBanner(prev => prev); // Revert the banner
                    break;
                case "logo":
                    setDashboardLogo(prev => prev); // Revert the dashboard logo
                    break;
                default:
                    console.error("Invalid picture type:", imageToDelete);
                    setLoading(false);
                    return;
            }
            setLoading(false); // Reset loading state on error
        }
    };
    
    

    const handleDeleteLogo = (logoType) => {
        // Show confirmation modal and store the logo type
        setImageToDelete(logoType);
        setShowConfirmDelete(true);
    };
    
    const cancelDelete = () => {
        setShowConfirmDelete(false);
    };

    return (
        <div className="p-6 mb-4">
            <h1 className="text-xl font-semibold">Theme Settings</h1>

            <div className="flex justify-end space-x-2 mb-2 w-full mt-4">
                <div className="flex ">

                    {/* Bulk Process */}
                    <div className="relative inline-block text-left">
                        <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 flex items-center"
                        >
                        <FaUpload className="mr-2" /> Upload
                        </button>
                        {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-50 border rounded shadow-lg z-10 dark:bg-gray-800 dark:border dark:border-gray-600">
                            <button
                            onClick={() => triggerModal("Login Banner")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center dark:hover:bg-gray-700"
                            >
                                <FaSignInAlt className="mr-2 text-teal-600 dark:text-teal-400" /> 
                                <span className="text-sm text-gray-900 dark:text-gray-200">Login Banner</span>
                            </button>
                            <button
                            onClick={() => triggerModal("Banner")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center dark:hover:bg-gray-700"
                            >
                                <MdInfoOutline className="mr-2 text-blue-600 dark:text-blue-400" /> 
                                <span className="text-sm text-gray-900 dark:text-gray-200">Banner</span>
                            </button>
                            <button
                            onClick={() => triggerModal("Logo")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center dark:hover:bg-gray-700"
                            >
                                <AiOutlineTrademarkCircle className="mr-2 text-red-600 dark:text-red-400" /> 
                                <span className="text-sm text-gray-900 dark:text-gray-200">Logo </span>
                            </button>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center h-52">
                {/* Animated Spinner */}
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    <div className='mb-4'>
                        <h6 className="text-lg font-semibold mb-2">1) Login Banner</h6>
                        {loginLogo ? (
                            <div className="w-full h-[350px] overflow-hidden relative">
                                <button
                                    className="absolute top-2 right-2 text-white hover:text-gray-900 bg-red-400 p-1 rounded-md cursor-pointer"
                                    onClick={() => handleDeleteLogo("login banner")}
                                    title="Delete Login Banner"
                                    >
                                    <IoMdClose />
                                </button>
                                <img
                                    src={loginLogo}
                                    alt="Login Logo Preview"
                                    className="w-full h-full object-fill"
                                />
                            </div>
                        ) : (
                            <p>No login logo to display</p>
                        )}
                    </div>


                    <div className='mb-4'>
                        <h6 className="text-lg font-semibold mb-2">2) Banner</h6>
                        {banner ? (
                            <div className="w-full h-[350px] overflow-hidden relative">
                                <button
                                    className="absolute top-2 right-2 text-white hover:text-gray-900 bg-red-400 p-1 rounded-md cursor-pointer"
                                    onClick={() => handleDeleteLogo("banner")}
                                    title="Delete Banner"
                                    >
                                    <IoMdClose />
                                </button>
                                <img
                                    src={banner}
                                    alt="Banner Preview"
                                    className="w-full h-full object-fill"
                                />
                            </div>
                        ) : (
                            <p>No banner to display</p>
                        )}
                    </div>

                    <div className='mb-4'>
                        <h6 className="text-lg font-semibold mb-2">3) Dashboard Logo</h6>
                        {dashboardLogo ? (
                            <div className="w-[160px] h-[80px] overflow-hidden relative">
                                <button
                                    className="absolute top-0 right-0 text-white hover:text-gray-900 bg-red-400 p-1 rounded-md cursor-pointer"
                                    onClick={() => handleDeleteLogo("logo")}
                                    title="Delete Logo"
                                    >
                                    <IoMdClose />
                                </button>
                                <img
                                    src={dashboardLogo}
                                    alt="Dashboard Logo Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <p>No dashboard logo to display</p>
                        )}
                    </div>
                </div>
            )}


        {/* Delete Confirmation */}
        {showConfirmDelete && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h5 className="text-lg font-semibold mb-4">Are you sure you want to delete this {imageToDelete}?</h5>
                    <div className="flex justify-between">
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded-md"
                            onClick={cancelDelete} // Cancel the deletion
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                            onClick={confirmDelete} // Confirm and delete the image
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}


        {/* Modal Component */}
        {modalType && isModalOpen && (
            <BannerModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={uploadSuccess}
            modalProcess={modalType}
            />
        )}


        </div>
    );
};

export default bannerManagement;