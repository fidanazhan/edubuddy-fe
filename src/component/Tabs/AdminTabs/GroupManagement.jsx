import { useEffect, useState } from "react";
import { Search } from 'lucide-react'
import { FaUpload, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import GroupModal from '../../Admin/GroupModal'
import axios from "axios";
import api from "../../../api/axios";
import GroupUserModal from "../../Admin/GroupUserModal";
import { useTranslation } from 'react-i18next';

const getTenantIdFromSubdomain = () => {
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0]; 
  return subdomain; // This will return "tenantname"
};

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGroupUserModalOpen, setIsGroupUserModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isBulkProcessModalOpen, setIsBulkProcessModalOpen] = useState(false);
  const { t, ready } = useTranslation(["admin", "common", "modal"]);

  const groupsPerPage = 5;
  const token = localStorage.getItem("accessToken");
  const tenantId = getTenantIdFromSubdomain();

  useEffect(() => {
    fetchGroups();
    setCurrentPage(1);
  }, []);

  const fetchGroups = async (page = 1, limit = groupsPerPage) => {
    setLoading(true);

    try {
      // Simulate delay correctly
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await api.get("/api/group/tenant", {
        params: { page, limit, search: searchTerm || undefined },
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant": tenantId
        }
      });

      setGroups(Array.isArray(response.data.data) ? response.data.data : []);
      setTotalPages(response.data.pages || 1);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddGroup = () => {
    fetchGroups()
    setIsAddModalOpen(false);
  };

  const handleUpdateGroup = () => {
    fetchGroups()
    setIsUpdateModalOpen(false);
  };

  const triggerModal = (type) => {
    setIsOpen(false);
    setIsBulkProcessModalOpen(true)
  };

  const handlePageChange = (pageNumber) => {
    fetchGroups(pageNumber);
    setCurrentPage(pageNumber);
  };



  const handleDeleteGroup = async () => {
    // setUsers(users.filter((user) => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);

    try {
      await api.delete(`/api/group/${selectedGroup._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant": tenantId
        },
      });

    } catch (error) {
      console.error("Error deleting user:", error);
    }

    fetchGroups()
  };

  if (!ready) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{t("admin:users.group.title")}</h1>
      </div>

      <div className="flex justify-end space-x-2 mb-4 w-full mt-4">
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setIsAddModalOpen(true)}
          >
            + {t("admin:users.group.add")}
          </button>
        </div>
        <div className="relative w-72">
          <input
            type="text"
            placeholder={t("admin:users.group.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchGroups(1, usersPerPage);
              }
            }}
            className="border p-2 rounded w-full dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 dark:text-gray-300"
          />
          <Search className="absolute top-2 right-3 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <div className="flex flex-col items-center h-52">
          {/* Animated Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full shadow-md overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-600">
                <tr>
                  <th className="py-2 px-4 border">{t("common:table.name")}</th>
                  <th className="py-2 px-4 border">{t("common:table.description")}</th>
                  <th className="py-2 px-4 border">{t("common:table.code")}</th>
                  <th className="py-2 px-4 border">{t("common:table.action")}</th>
                </tr>
              </thead>
              <tbody>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <tr key={group._id} className="border-t">
                      <td className="py-2 px-4 border text-sm">{group.name}</td>
                      <td className="py-2 px-4 border text-sm">{group.description}</td>
                      <td className="py-2 px-4 border text-sm">{group.code}</td>
                      <td className="border border-gray-200 px- py-2">
                        <div className="flex justify-center space-x-2">
                          {/* <MdGroups2 
                            className="text-blue-400 cursor-pointer"
                            onClick={() => {
                              setSelectedGroup(group);
                              setIsGroupUserModalOpen(true);
                            }}
                          /> */}
                          <FaEdit
                            className="text-green-400 cursor-pointer"
                            onClick={() => {
                              setSelectedGroup(group);
                              setIsUpdateModalOpen(true);
                            }}
                          />
                          <FaTrash
                            className="text-red-400 cursor-pointer"
                            onClick={() => {
                              setSelectedGroup(group);
                              setIsDeleteModalOpen(true);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))) : (
                  <tr>
                    <td colSpan="5" className="border border-gray-200 px-4 py-2 text-center">
                      {t("admin:users.group.not_found")}
                    </td>
                  </tr>
                )
                }
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

      {isAddModalOpen && (
        <GroupModal
          title={t("modal:group.add_title")}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddGroup}
          isEdit={false}
        />
      )}

      {/* Update Group Modal */}
      {isUpdateModalOpen && selectedGroup && (
        <GroupModal
          title={t("modal:group.update_title")}
          onClose={() => setIsUpdateModalOpen(false)}
          initialValues={selectedGroup}
          onSubmit={handleUpdateGroup}
          isEdit={true}
        />
      )}

      {isGroupUserModalOpen && selectedGroup && (
        <GroupUserModal
          group={selectedGroup}
          onClose={() => setIsGroupUserModalOpen(false)}
          token={token}
          tenantId={tenantId}
        />
      )}

      {/* Delete Group Modal */}
      {isDeleteModalOpen && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t("modal:delete.message1_group")}
              <span className="text-red-500">{selectedGroup.name}</span>?
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
                onClick={handleDeleteGroup}
              >
                {t("common:button.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
