import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const configScreen = () => {
  const location = useLocation(); // Get the current route location
  const [activeTab, setActiveTab] = useState(null); // Default active tab
  const { t, ready } = useTranslation("tabs");

  useEffect(() => {
    // Sync activeTab with the current location
    if (location.pathname === '/admin-panel/system-config/authentication') {
      setActiveTab('authentication');
    } else if (location.pathname === '/admin-panel/system-config/model') {
      setActiveTab('model');
    } else if (location.pathname === '/admin-panel/system-config/theme') {
      setActiveTab('theme');
    } else if (location.pathname === '/admin-panel/system-config/suggestion-question-template') {
      setActiveTab('questions');
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (!ready) return null;

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
              {t("admin.system.authentication")}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin-panel/system-config/model"
              onClick={() => handleTabClick('model')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'model' ? 'text-blue-600' : ''}`}
            >
              {t("admin.system.model")}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin-panel/system-config/theme"
              onClick={() => handleTabClick('theme')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'theme' ? 'text-blue-600' : ''}`}
            >
              {t("admin.system.theme")}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/admin-panel/system-config/suggestion-question-template"
              onClick={() => handleTabClick('Suggestion Questions')}
              className={`hover:text-blue-500 font-semibold ${activeTab === 'questions' ? 'text-blue-600' : ''}`}
            >
              {t("admin.system.suggestion")}
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
