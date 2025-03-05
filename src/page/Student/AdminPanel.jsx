import React, { useEffect } from 'react';
import { Link, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import UserTab from '../../component/Tabs/AdminTabs/userTab.jsx';
import RoleTab from '../../component/Tabs/AdminTabs/roleTab.jsx';
import DashboardTab from '../../component/Tabs/dashboardTab.jsx';
import DocumentTab from '../../component/Tabs/documentTab.jsx';
import NotificationTab from '../../component/Tabs/notificationTab.jsx';
import TokenTab from '../../component/Tabs/tokenTab.jsx';
import StorageTab from '../../component/Tabs/storageTab.jsx';
import SystemConfigTab from '../../component/Tabs/configTab.jsx';
import { RxDashboard } from "react-icons/rx";
import { IoDocumentAttachOutline, IoNotificationsOutline } from "react-icons/io5";
import { PiUsersThree } from "react-icons/pi";
import { GiToken } from "react-icons/gi";
import { TiCloudStorageOutline } from "react-icons/ti";
import { useAuth } from '../../context/JWTContext.jsx'
import { useTranslation } from "react-i18next";

const AdminPanel = () => {
  const { user } = useAuth();
  const { t, ready } = useTranslation("tabs");

  const location = useLocation();

  const tabs = [
    { name: t("admin.dashboard"), path: "/admin-panel/dashboard", icon: <RxDashboard />, component: <DashboardTab /> },
    { name: t("admin.document"), path: "/admin-panel/document", icon: <IoDocumentAttachOutline />, component: <DocumentTab /> },
    { name: t("admin.notification"), path: "/admin-panel/notification", icon: <IoNotificationsOutline />, component: <NotificationTab /> },
    { name: t("admin.users.title"), path: "/admin-panel/user-management/user", icon: <PiUsersThree />, component: <UserTab /> },
    { name: t("admin.token.title"), path: "/admin-panel/token/users", icon: <GiToken />, component: <TokenTab /> },
    { name: t("admin.storage.title"), path: "/admin-panel/storage/users", icon: <TiCloudStorageOutline />, component: <StorageTab /> },
    { name: t("admin.system.title"), path: "/admin-panel/system-config/authentication", icon: <RxDashboard />, component: <SystemConfigTab /> },
  ];

  const parentPaths = {
    "Users": "/admin-panel/user-management",
    "Token": "/admin-panel/token",
    "Storage": "/admin-panel/storage",
    "System-Configuration": "/admin-panel/system-config"
  };

  if (!ready) return null;

  return (
    <div className="w-full py-2">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const isActive =
            location.pathname === tab.path
            || (parentPaths[tab.name] && location.pathname.startsWith(parentPaths[tab.name]));

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-300 ${isActive
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
