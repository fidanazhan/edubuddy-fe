import { useEffect, useState } from "react";

const getTenantIdFromSubdomain = () => {
    const hostname = window.location.hostname; // e.g., tenantname.localhost
    const subdomain = hostname.split('.')[0]; // Get the part before ".localhost"
    return subdomain; // This will return "tenantname"
  };

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {

      const tenantId = getTenantIdFromSubdomain();

      try {
        const response = await fetch("http://localhost:5000/api/group/tenant", {
          headers: {
            "Content-Type": "application/json",
            "x-tenant": tenantId // Replace with actual tenant ID
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Groups</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Code</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group._id} className="border-t">
                  <td className="py-2 px-4 border text-sm">{group.name}</td>
                  <td className="py-2 px-4 border text-sm">{group.description}</td>
                  <td className="py-2 px-4 border text-sm">{group.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
