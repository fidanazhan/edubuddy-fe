import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import UserModal from "../../Admin/UserModal";
// Balance
import { Wallet, DollarSign, BanknoteIcon } from "lucide-react";
// Used
import { History, Recycle, RefreshCw, Archive, ShoppingBag } from "lucide-react";
// Distributed
import { Network, Share2, ArrowLeftRight, Banknote } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../../context/JWTContext";

const StorageUsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { t, ready } = useTranslation(["admin", "common"]);
    const [admin, setAdmin] = useState(null);
    const { user } = useAuth();

    const usersPerPage = 5;
    const subdomain = window.location.hostname.split(".")[0];

    useEffect(() => {
        fetchUsers();
        setCurrentPage(1);
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        try {

            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/user/${user.id}`, {
                        "x-tenant": subdomain,
                    });
                    setAdmin(response.data);
                } catch (error) {
                    console.error("Error fetching admin info:", error);
                }
            }, 1000);
        } catch (error) {
            console.error("Error fetching admin info:", error);
        }
    };

    const fetchUsers = async (page = 1, limit = usersPerPage) => {
        setLoading(true);  // Show loading immediately when search is triggered
        try {

            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/user`, {
                        params: { page, limit, search: searchTerm || undefined },
                        headers: { "x-tenant": subdomain },
                    });

                    setUsers(Array.isArray(response.data.data) ? response.data.data : []);
                    // setUsers(response.data.data || []);
                    setTotalPages(response.data.pages || 1);
                    setCurrentPage(page);
                } catch (error) {
                    console.error("Error fetching users:", error);
                    setUsers([]);
                }
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (pageNumber) => {
        fetchUsers(pageNumber);
        setCurrentPage(pageNumber);
    };

    const handleSearch = () => {
        fetchUsers(1, usersPerPage); // Trigger search query to the backend
    };

    const balanceStorage = (totalStorage, usedStorage) => {
        return totalStorage - usedStorage;
    }

    if (!ready) return null;

    return (
        <div className="p-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* <div>Storage Balance | Storage Used | Storage Distributed | ???</div> */}
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("admin:storage.users.widget_total")}</h2>
                        <p className="text-gray-500 mt-4">{admin?.totalStorage ?? "Failed to get Storage"}</p>
                    </div>
                    {/* <Wallet className='w-20 h-20 text-blue-500' /> */}
                </div>

                {/* Widget 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("admin:storage.users.widget_used")}</h2>
                        <p className="text-gray-500 mt-4">{admin?.usedStorage ?? "Failed to get Storage"}</p>
                    </div>
                    {/* <History className='w-20 h-20 text-gray-400' /> */}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("admin:storage.users.widget_balance")}</h2>
                        <p className="text-gray-500 mt-4">{admin
                                    ? balanceStorage(admin.totalStorage ?? 0, admin.usedStorage ?? 0)
                                    : "Failed to get Storage"}</p>
                    </div>
                    {/* <Network className='w-20 h-20 text-blue-500' /> */}
                </div>

                {/* Widget 4 */}
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80">{t("admin:storage.users.widget_distributed")}</h2>
                        <p className="text-gray-500 mt-4">{admin?.distributedStorage ?? "Failed to get Storage"}</p>
                    </div>
                    {/* <Banknote className='w-20 h-20 text-blue-500' /> */}
                </div>

            </div>
            <div className="flex justify-between items-center mb-4 mt-4">
                <h1 className="text-xl font-semibold">{t("admin:storage.users.title")}</h1>
            </div>

            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-lg px-4 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300/80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleSearch} // Call search function when clicked
                >
                    {t("common:button.search")}
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center">
                    {/* Animated Spinner */}
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    <div>
                        <table className="table-auto w-full border-collapse border border-gray-200 dark:text-gray-300/80 dark:border-gray-900 dark:bg-gray-900">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-600 dark:text-gray-100/80">
                                    <th className="border border-gray-200 px-4 py-2">No</th>
                                    <th className="border border-gray-200 px-4 py-2">{t("common:table.name")}</th>
                                    <th className="border border-gray-200 px-4 py-2">{t("common:table.role")}</th>
                                    <th className="border border-gray-200 px-4 py-2">Email</th>
                                    <th className="border border-gray-200 px-4 py-2">{t("admin:storage.users.table.total_storage")}</th>
                                    <th className="border border-gray-200 px-4 py-2">{t("admin:storage.users.table.used_storage")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user._id} className="text-center">
                                            <td className="border border-gray-200 px-4 py-2 text-sm">
                                                {(currentPage - 1) * usersPerPage + index + 1}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{user.name}</td>
                                            <td className="border border-gray-200 px-3 py-2 text-sm">{user.role?.name}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{user.email}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{user.totalStorage}</td>
                                            <td className="border border-gray-200 px-1 py-2 text-sm">{user.usedStorage}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-200 px-4 py-2 text-center">
                                            {t("admin:storage.users.not_found_message")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`px-3 py-1 rounded-lg border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-900 dark:text-gray-300 dark:border-gray-900"
                                    }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorageUsersManagement;
