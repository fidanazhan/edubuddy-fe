import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaUpload, FaPlus, FaLayerGroup } from "react-icons/fa";
import UserModal from "../../Admin/UserModal";
import { Search } from 'lucide-react'
import ConfirmationPopup from "../../Admin/ConfirmationPopup";
import UserBulkProcessModal from '../../Admin/UserBulkProcessModal'

const UserManagement = () => {
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [modalType, setModalType] = useState(null);
  const [isBulkProcessModalOpen, setIsBulkProcessModalOpen] = useState(false);

  const usersPerPage = 5;
  const subdomain = window.location.hostname.split(".")[0];
  const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchGroup();
        setCurrentPage(1);
    }, []);

  const fetchUsers = async (page = 1, limit = usersPerPage) => {
    setLoading(true); 
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

      setRoles(response.data);
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
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:5000/api/user/bulk-upload", {
        headers: { "x-tenant": subdomain },
        method: "POST",
        body: formData,
      });
  
      // if (!response.ok) {
      //   throw new Error("File upload failed");
      // }

      if (response.status === 201 || response.status === 200) {
        fetchUsers
      }
  
      const result = await response.json();
      console.log("Upload successful", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };
  

    const handlePageChange = (pageNumber) => {
        fetchUsers(pageNumber);
        setCurrentPage(pageNumber);
    };

  const handleAddUser = () => {
    fetchUsers()
    setIsAddModalOpen(false);
  };

    const handleUpdateUser = () => {
        fetchUsers()
        setIsUpdateModalOpen(false);
    };




  const triggerModal = (type) => {
    setModalType(type);
    setIsOpen(false);
    setIsBulkProcessModalOpen(true)
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">User Management</h1>
      </div>

      <div className="flex justify-end space-x-2 mb-4 w-full mt-4">
        <div className="flex space-x-2">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 flex items-center"
            >
              <FaUpload className="mr-2" /> Bulk Process
            </button>
            {isOpen && (
              <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                <button
                  onClick={() => triggerModal("Bulk Add")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center"
                >
                  <FaPlus className="mr-2 text-teal-600" /> Bulk Add
                </button>
                <button
                  onClick={() => triggerModal("Bulk Update")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center"
                >
                  <FaEdit className="mr-2 text-blue-600" /> Bulk Update
                </button>
                <button
                  onClick={() => triggerModal("Bulk Remove")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center"
                >
                  <FaTrash className="mr-2 text-red-600" /> Bulk Remove
                </button>
              </div>
            )}
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add User
          </button>
        </div>
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchUsers(1, usersPerPage);
              }
            }}
            className="border p-2 rounded w-full"
          />
          <Search className="absolute top-2 right-3 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center h-52">
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
                  <th className="border border-gray-200 px-4 py-2">Group</th>
                  <th className="border border-gray-200 px-4 py-2">Email</th>
                  <th className="border border-gray-200 px-4 py-2">Status</th>
                  <th className="border border-gray-200 px-4 py-2">Role</th>
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
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {user.groups?.map((group) => (
                          <p key={group._id} className="text-left">{group.name}</p>
                        ))}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{user.email}</td>
                      <td className="border border-gray-200 px-1 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            user.status === 1
                              ? "bg-green-200 text-green-800"
                              : user.status === 0
                              ? "bg-red-200 text-red-800"
                              : "bg-white text-gray-800 border-gray-300"
                          }`}
                        >
                          {/* {user.status === 1 ? "Active" : user.status === 0 ? "Not Active" : "Unknown"} */}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">{user.role?.name}</td>
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

      {/* Modal Component */}
      {modalType && isBulkProcessModalOpen && (

        <UserBulkProcessModal 
          onClose={() => setIsBulkProcessModalOpen(false)} 
          modalProcess={modalType}
        />
      )}
    </div>
  );
};

export default UserManagement;
