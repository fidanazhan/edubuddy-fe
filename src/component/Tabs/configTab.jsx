import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const configScreen = () => {
  const location = useLocation(); // Get the current route location
  const [activeTab, setActiveTab] = useState(null); // Default active tab

  useEffect(() => {
    // Sync activeTab with the current location
    if (location.pathname === '/admin-panel/system-config/authentication') {
      setActiveTab('authentication');
    } else if (location.pathname === '/admin-panel/system-config/model') {
      setActiveTab('model');
    } else if (location.pathname === '/admin-panel/rsystem-config/theme') {
      setActiveTab('theme');
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-44 bg-gray-50 p-4 border-r ">
        <ul className='list-none'>
          <li className="mb-4">
            <Link
              to="/admin-panel/system-config/authentication"
              onClick={() => handleTabClick('authentication')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'authentication' ? 'text-blue-600' : ''}`}
            >
              Authentication
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin-panel/system-config/model"
              onClick={() => handleTabClick('model')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'model' ? 'text-blue-600' : ''}`}
            >
              Model
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin-panel/system-config/theme"
              onClick={() => handleTabClick('theme')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'theme' ? 'text-blue-600' : ''}`}
            >
              Theme
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

export default configScreen;
