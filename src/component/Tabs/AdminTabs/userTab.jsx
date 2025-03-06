import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const UserScreen = () => {
  const location = useLocation(); // Get the current route location
  const [activeTab, setActiveTab] = useState(null); // Default active tab

  useEffect(() => {
    // Sync activeTab with the current location
    if (location.pathname === '/admin-panel/user-management/user') {
      setActiveTab('user');
    } else if (location.pathname === '/admin-panel/group-management/group') {
      setActiveTab('group');
    } else if (location.pathname === '/admin-panel/role-management/role') {
      setActiveTab('role');
    } 
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-44 p-4 border-r ">
        <ul className='list-none'>
          <li className="mb-4">
            <Link
              to="/admin-panel/user-management/user"
              onClick={() => handleTabClick('user')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'user' ? 'text-blue-600' : ''}`}
            >
              User
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin-panel/user-management/group"
              onClick={() => handleTabClick('group')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'group' ? 'text-blue-600' : ''}`}
            >
              Group
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin-panel/user-management/role"
              onClick={() => handleTabClick('role')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'role' ? 'text-blue-600' : ''}`}
            >
              Role
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserScreen;
