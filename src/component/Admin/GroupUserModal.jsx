import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../api/axios";
import { IoMdClose } from "react-icons/io";

const GroupUserModal = ({ group, onClose, token, tenantId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 5;

  useEffect(() => {
    fetchGroupUsers();
  }, [currentPage, searchTerm]);

  const fetchGroupUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/group/getUsers/${group._id}`, {
        params: { page: currentPage, limit: usersPerPage, search: searchTerm || undefined },
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant": tenantId,
        },
      });

      console.log("Response: " + JSON.stringify(response.data.data))

      setGroupUsers(Array.isArray(response.data.data) ? response.data.data : []);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!selectedUser) return;

    try {
        await api.post(
        `/api/group/addUser/${group._id}`,
        { userId: selectedUser.value },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant": tenantId,
            },
        }
        );

        fetchGroupUsers(); // Refresh list after adding user
        setSelectedUser(null);
    } catch (err) {
        console.error("Error adding user", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[70rem] p-6">
        <div className="text-xl font-bold mb-4 flex justify-between items-center">
            <h2>{group.name}</h2>
            <button
              className="text-white hover:text-gray-900 bg-red-400 p-1 rounded-md"
              onClick={onClose}
              >
              <IoMdClose />
            </button>
        </div>
        
        <div className="flex">
            {/* Left Side - Users List */}
            <div className="w-1/2 pr-4 border-r">
            <h2 className="text-lg font-semibold mb-4">User List</h2>

            {/* Search Bar */}
            <Select
                options={groupUsers.map((user) => ({
                value: user._id,
                label: `${user.userId.name} (${user.userId.email})`,
                }))}
                onInputChange={(value) => setSearchTerm(value)}
                onChange={setSelectedUser}
                placeholder="Search user..."
                className="mb-4"
            />

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-sm">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-sm">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                    <tr>
                        <td colSpan="2" className="text-center py-4">Loading...</td>
                    </tr>
                    ) : error ? (
                    <tr>
                        <td colSpan="2" className="text-center text-red-500 py-4">{error}</td>
                    </tr>
                    ) : groupUsers.length > 0 ? (
                    groupUsers.map((user) => (
                        <tr key={user._id} className="text-center">
                        <td className="border border-gray-300 px-4 py-2 text-sm">{user.userId.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{user.userId.email}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="2" className="text-center py-4">No users found</td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-300 rounded-lg disabled:opacity-50"
                >
                Prev
                </button>
                <span className="px-3 py-1">
                {currentPage} / {totalPages}
                </span>
                <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-300 rounded-lg disabled:opacity-50"
                >
                Next
                </button>
            </div>



            </div>

            {/* Right Side - Add User */}
            <div className="w-1/2 pl-4">
                <h3 className="text-lg font-semibold mb-4">Add User to Group</h3>

                {/* User Selection */}
                {/* <Select
                    options={availableUsers}
                    onChange={setSelectedUser}
                    placeholder="Select user..."
                    className="mb-4"
                /> */}

                {/* Add User Button */}
                <button
                    onClick={handleAddUser}
                    disabled={!selectedUser}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    Add User
                </button>
            </div>
        </div>


      </div>


    </div>
  );
};

export default GroupUserModal;
