import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaEdit, FaTrash, FaUpload, FaPlus, FaLayerGroup } from "react-icons/fa";
import UserModal from "../../Admin/UserModal";
import { Search } from 'lucide-react'
import UserBulkProcessModal from '../../Admin/UserBulkProcessModal'
import { useTranslation } from 'react-i18next';
import api from '../../../api/axios'
import Toast from '../../Toast/Toast'

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
  const [toast, setToast] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isBulkProcessModalOpen, setIsBulkProcessModalOpen] = useState(false);
  const [filterByGroup, setFilterByGroup] = useState(false);
  const { t, ready } = useTranslation(["admin", "common", "modal"]);

  const usersPerPage = 5;
  const subdomain = window.location.hostname.split(".")[0];
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("accessToken");

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
          const response = await api.get(`/api/user`, {
            params: {
              page,
              limit,
              search: searchTerm || undefined,
              filterByGroup: filterByGroup ? "true" : undefined
            },
            headers: {
              "x-tenant": subdomain,
              "Authorization": `Bearer ${token}`,
            },
          });

          setUsers(Array.isArray(response.data.data) ? response.data.data : []);
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
      const response = await api.get(`/api/role/select`, {
        headers: { "x-tenant": subdomain },
      });

      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchGroup = async () => {
    try {
      const response = await api.get(`/api/group/tenant/select`, {
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
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/user/bulk-upload", {
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
    showToast("Successfully added!", "bg-green-500", "success");
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
      await api.delete(`/api/user/${selectedUser._id}`, {
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


  const downloadUsers = async () => {
    try {
      const response = await api.get(`/api/user/download`, {
        params: {
          search: searchTerm || undefined,
          filterByGroup: filterByGroup ? "true" : "false"
        },
        headers: {
          "x-tenant": subdomain,
          "Authorization": `Bearer ${token}`,
        },
        responseType: 'blob', // Important to handle file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading users:", error);
    }
  };

  if (!ready) return null;


  // ------------------------------- SHOW TOAST --------------------------------

  const showToast = (message, color, status) => {
    setToast({ message, color, status });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{t("admin:users.user.title")}</h1>
      </div>

      <div className="flex justify-end space-x-2 mb-2 w-full mt-4">
        <div className="flex space-x-2">

          {/* Download */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => downloadUsers()}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600 flex items-center"
            >
              <FaDownload className="mr-2" /> {t("common:button.download")}
            </button>
          </div>

          {/* Bulk Process */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 flex items-center"
            >
              <FaUpload className="mr-2" /> {t("common:button.bulk_process")}
            </button>
            {isOpen && (

          <div className="absolute mt-2 w-56 bg-white shadow-lg rounded-lg z-10 dark:bg-gray-800 dark:border dark:border-gray-600">
            <button
              onClick={() => triggerModal(t("admin:users.user.bulk_add"))}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
            >
              <FaPlus className="mr-2 text-teal-600 dark:text-teal-400" />
              <span className="text-sm text-gray-900 dark:text-gray-200">{t("admin:users.user.bulk_add")}</span>
            </button>
            <button
              onClick={() => triggerModal(t("admin:users.user.bulk_update"))}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
            >
              <FaEdit className="mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-900 dark:text-gray-200">{t("admin:users.user.bulk_update")}</span>
            </button>
            <button
              onClick={() => triggerModal(t("admin:users.user.bulk_remove"))}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
            >
              <FaTrash className="mr-2 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-900 dark:text-gray-200">{t("admin:users.user.bulk_remove")}</span>
            </button>
            {/* <button
              onClick={() => triggerModal(t("admin:users.user.assign_group"))}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
            >
              <MdGroups2 className="mr-2 text-teal-600 dark:text-teal-400 h-5 w-5" />
              <span className="text-sm text-gray-900 dark:text-gray-200">{t("admin:users.user.assign_group")}</span>
            </button> */}
          </div>


            )}
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setIsAddModalOpen(true)}
          >
            + {t("admin:users.user.add")}
          </button>
        </div>
        <div className="relative w-72">
          <input
            type="text"
            placeholder={t("admin:users.user.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchUsers(1, usersPerPage);
              }
            }}
            className="border p-2 rounded w-full dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300"
          />
          <Search className="absolute top-2 right-3 text-gray-500 w-5 h-5" />
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="filterByGroup"
            checked={filterByGroup}
            onChange={(e) => setFilterByGroup(e.target.checked)}
            className="cursor-pointer"
          />
          <label htmlFor="filterByGroup" className="cursor-pointer">
            {t("admin:users.user.filter_check")}
          </label>
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
                <tr className="bg-gray-100 dark:bg-gray-600">
                  <th className="border border-gray-200 px-4 py-2">No</th>
                  <th className="border border-gray-200 px-4 py-2">{t("common:table.name")}</th>
                  <th className="border border-gray-200 px-4 py-2">{t("common:table.group")}</th>
                  <th className="border border-gray-200 px-4 py-2">Email</th>
                  <th className="border border-gray-200 px-4 py-2">Status</th>
                  <th className="border border-gray-200 px-4 py-2">{t("common:table.role")}</th>
                  <th className="border border-gray-200 px-4 py-2">{t("common:table.action")}</th>
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
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${user.status === 1
                            ? "bg-green-200 dark:bg-green-300"
                            : user.status === 0
                              ? "bg-red-200 dark:bg-red-300"
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
                    <td colSpan="7" className="border border-gray-200 px-4 py-2 text-center">
                      {t("admin:users.user.not_found")}
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
                className={`px-3 py-1 rounded-lg border ${currentPage === index + 1 ? "bg-blue-500  text-white" : "bg-white dark:bg-gray-500 dark:font-semibold"
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
          title={t("admin:users.user.add")}
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
          title={t("admin:users.user.bulk_update")}
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
              {t("modal:delete.message1_user")}
              <span className="text-red-500">{selectedUser.name}</span>?
            </h3>
            <p className="text-gray-600 mb-6">
              {t("modal:delete.message2")}
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                {t("common:button.cancel")}
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={handleDeleteUser}
              >
                {t("common:button.confirm")}
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

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          color={toast.color}
          status={toast.status}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
