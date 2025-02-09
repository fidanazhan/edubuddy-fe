import { lazy, Suspense, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { IoDocumentAttachOutline, IoNotificationsOutline } from "react-icons/io5";
import { useAuth } from '../../context/JWTContext'

const Dashboard = lazy(() => import("./Workspace/Dashboard"));
const FileManagement = lazy(() => import("./Workspace/Document"));
const NotificationTab = lazy(() => import("./Workspace/Notification"));

const Workspace = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tabs = [
    { name: "Dashboard", icon: <RxDashboard />, component: Dashboard, canAccess: true},
    { name: "Document", icon: <IoDocumentAttachOutline />, component: FileManagement, canAccess: user?.permissions?.includes("m_documents")  },
    { name: "Notification", icon: <IoNotificationsOutline />, component: NotificationTab, canAccess: true},
  ].filter(tab => tab.canAccess);;

  return (
    <div className="w-full py-1">
      {/* Horizontal flex container for tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 ${
              activeTab === tab.name
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            aria-current={activeTab === tab.name ? "page" : undefined}
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800 dark:border-white"></div>
            </div>
          }
        >
          {tabs.map(
            (tab) =>
              activeTab === tab.name && (
                <div key={tab.name} className="text-gray-800 dark:text-white">
                  <tab.component />
                </div>
              )
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Workspace;
