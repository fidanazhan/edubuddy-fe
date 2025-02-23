import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import UserModal from "../../Admin/UserModal";
// Balance
import { Wallet, DollarSign, BanknoteIcon } from "lucide-react";
// Used
import { History, Recycle, RefreshCw, Archive, ShoppingBag } from "lucide-react";
// Distributed
import { Network, Share2, ArrowLeftRight, Banknote } from "lucide-react";



const StorageUsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const usersPerPage = 5;
    const subdomain = window.location.hostname.split(".")[0];

    useEffect(() => {
        fetchUsers();
        setCurrentPage(1);
    }, []);

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


    return (
        <div className="p-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* <div>Storage Balance | Storage Used | Storage Distributed | ???</div> */}
                {/* <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700">Storage Balance</h2>
                        <p className="text-gray-500 mt-4">1500/500000</p>
                    </div>
                    <Wallet className='w-20 h-20 text-blue-500' />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700">Storage Used</h2>
                        <p className="text-gray-500 mt-4">1000/250000</p>
                    </div>
                    <History className='w-20 h-20 text-gray-400' />
                </div> */}

                {/* Widget 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700">Storage Distributed</h2>
                        <p className="text-gray-500 mt-4">12500/45000</p>
                    </div>
                    {/* <Network className='w-20 h-20 text-blue-500' /> */}
                </div>

                {/* Widget 4 */}
                {/* <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700">???</h2>
                        <p className="text-gray-500 mt-4">Put context here</p>
                    </div>
                    <Banknote className='w-20 h-20 text-blue-500' />
                </div> */}

            </div>
            <div className="flex justify-between items-center mb-4 mt-4">
                <h1 className="text-xl font-semibold">Users Storage List</h1>
            </div>

            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-lg px-4 py-2 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleSearch} // Call search function when clicked
                >
                    Search
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
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-200 px-4 py-2">No</th>
                                    <th className="border border-gray-200 px-4 py-2">Name</th>
                                    <th className="border border-gray-200 px-4 py-2">Role</th>
                                    <th className="border border-gray-200 px-4 py-2">Email</th>
                                    <th className="border border-gray-200 px-4 py-2">Total Storage</th>
                                    <th className="border border-gray-200 px-4 py-2">Used Storage</th>
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
                                        <td colSpan="5" className="border border-gray-200 px-4 py-2 text-center">
                                            No users found.
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
                                className={`px-3 py-1 rounded-lg border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
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
