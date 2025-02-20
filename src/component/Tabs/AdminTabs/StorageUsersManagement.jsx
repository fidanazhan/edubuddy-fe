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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const usersPerPage = 5;
    const subdomain = window.location.hostname.split(".")[0];

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchGroup();
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


    const fetchRoles = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/role/select`, {
                headers: { "x-tenant": subdomain },
            });

            setRoles(response.data); // Assuming the response contains the roles
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchGroup = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/group/tenant/select`, {
                headers: { "x-tenant": subdomain },
            });

            console.log("Response(Group): " + response.data)
            setGroups(response.data); // Assuming the response contains the roles
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);

        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            const formattedUsers = parsedData.map((user, index) => ({
                id: users.length + index + 1,
                name: user.Name || "Unknown",
                email: user.Email || "No Email",
                status: user.Status || "Not Active",
                role: user.Role || "Student",
            }));

            setUsers([...users, ...formattedUsers]);
            setLoading(false);
        };

        reader.onerror = () => {
            console.error("File reading error");
            setLoading(false);
        };
    };

    const handlePageChange = (pageNumber) => {
        fetchUsers(pageNumber);
        setCurrentPage(pageNumber);
    };

    const handleAddUser = () => {
        // setUsers([...users, { ...newUser, id: users.length + 1 }]);
        // alert("User added successfully! from parent modal");
        fetchUsers()
        setIsAddModalOpen(false);
    };

    const handleUpdateUser = () => {
        fetchUsers()
        setIsUpdateModalOpen(false);
    };


    const handleDeleteUser = async () => {
        // setUsers(users.filter((user) => user.id !== selectedUser.id));
        setIsDeleteModalOpen(false);

        try {
            await axios.delete(`http://localhost:5000/api/user/${selectedUser._id}`, {
                headers: { "x-tenant": subdomain },
            });
            setUsers(users.filter((user) => user.id !== selectedUser.id));  // Remove the user from the list
            setIsDeleteModalOpen(false);  // Close the modal
        } catch (error) {
            console.error("Error deleting user:", error);
        }

        fetchUsers()

    };

    const handleSearch = () => {
        fetchUsers(1, usersPerPage); // Trigger search query to the backend
    };


    return (
        <div className="p-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* <div>Storage Balance | Storage Used | Storage Distributed | ???</div> */}
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
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
                </div>

                {/* Widget 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                    <div className=''>
                        <h2 className="text-xl font-semibold text-gray-700">Storage Distributed</h2>
                        <p className="text-gray-500 mt-4">12500/45000</p>
                    </div>
                    <Network className='w-20 h-20 text-blue-500' />
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
                <div className="flex space-x-4">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600">
                        <FaUpload className="inline-block mr-2" /> Upload Excel
                    </label>

                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        + Add User
                    </button>
                </div>
            </div>

            {/* {loading && (
        <div className="text-center py-4">
          <span className="text-blue-500 font-semibold">Processing file... Please wait.</span>
        </div>
      )} */}

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
                                    <th className="border border-gray-200 px-4 py-2">Action</th>
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
                                            <td className="border border-gray-200 px- py-2">
                                                <div className="flex justify-center space-x-2">
                                                    <FaEdit
                                                        className="text-green-400 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setIsUpdateModalOpen(true);
                                                        }}
                                                    />
                                                    <FaTrash
                                                        className="text-red-400 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                    />
                                                </div>
                                            </td>
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



            {/* Add User UserModal */}
            {isAddModalOpen && (
                <UserModal
                    title="Add User"
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddUser}
                    roles={roles}
                    isEdit={false}
                    groups={groups}
                />
            )}

            {/* Update User UserModal */}
            {isUpdateModalOpen && selectedUser && (
                <UserModal
                    title="Update User"
                    onClose={() => setIsUpdateModalOpen(false)}
                    initialValues={selectedUser}
                    roles={roles}
                    onSubmit={handleUpdateUser}
                    isEdit={true}
                    groups={groups}
                />
            )}

            {/* Delete User UserModal */}
            {isDeleteModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Are you sure you want to delete{" "}
                            <span className="text-red-500">{selectedUser.name}</span>?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            This action cannot be undone. Please confirm your decision.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                onClick={handleDeleteUser}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorageUsersManagement;
