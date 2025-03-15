import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../api/axios";
import { IoMdClose } from "react-icons/io";

const GroupUserModal = ({ group, onClose, token, tenantId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSelectDisplay, setLoadingSelectDisplay] = useState(false);
  const [selectedUserForSearch, setSelectedUserForSearch] = useState(false);

  const usersPerPage = 5;

  useEffect(() => {
    fetchGroupUsers();
  }, []);

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

  const fetchUsers = async (query) => {
    if (!query.trim()) return; // Prevent empty searches
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await api.get(`/api/user/select`, {
        params: { search: query },
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant": tenantId,
        },
      });
  
      console.log("Fetched Users:", response.data);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchUser = () => {
    if (setSelectedUserForSearch) {
      console.log("Selected User for Search:", setSelectedUserForSearch);
    } else {
      console.log("No user selected.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg shadow-lg w-[70rem] p-6">
        <div className="text-xl font-bold mb-4 flex justify-between items-center">
            <h2>{group.name}</h2>
            <button
              className="text-white hover:text-gray-900 bg-red-400 p-1 rounded-md"
              onClick={onClose}
              >
              <IoMdClose />
            </button>
        </div>
        
        <div className="">
            {/* Left Side - Users List */}
            <div className="pr-4 border-r">
            <h2 className="text-lg font-semibold mb-4">User List</h2>

            {/* Search Bar */}
            <Select
              options={users.map((user) => ({
                value: user._id,
                label: `${user.name} (${user.email})`,
              }))}
              isMulti
              isClearable
              onInputChange={(value) => setSearchTerm(value)}
              onChange={(selectedOption) => {
                console.log("Selected option:", selectedOption); // Debugging
                setSelectedUserForSearch(selectedOption);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  fetchUsers(searchTerm);
                }
              }}
              isLoading={loadingSelectDisplay} // Show loading indicator
              placeholder="Search user and press Enter..."
              className="mb-2"
            />

              <button
                  onClick={handleSearchUser}
                  disabled={!selectedUserForSearch}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 mb-2"
              >
                  Add User
              </button>

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
        </div>


      </div>


    </div>
  );
};

export default GroupUserModal;
