import React from 'react'
import api from '../../api/axios';

const DeleteGroupModal = (selectedGroup, onClose, onSuccess) => {

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

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete{" "}
              <span className="text-red-500">{selectedGroup.name}</span>?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Please confirm your decision.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                onClick={() => onClose()}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={handleDeleteGroup}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
    )
}

export default DeleteGroupModal;