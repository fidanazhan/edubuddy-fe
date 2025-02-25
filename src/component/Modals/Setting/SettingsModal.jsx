import { lazy, Suspense, useState } from "react";
import Modal from 'react-modal';
import { RxDashboard } from "react-icons/rx";
import { FaTimes } from 'react-icons/fa';
const Theme = lazy(() => import("./Theme"));
const Language = lazy(() => import("./Language"));

const SettingsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("Theme");

    const settingsTabs = [
        { name: "Theme", icon: <RxDashboard />, component: Theme },
        { name: "Language", icon: <RxDashboard />, component: Language },
    ]

    if (!isOpen) return null; // Don't render if isOpen is false
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose} // Required for accessibility
            contentLabel="Settings Modal"
            className="bg-white rounded-lg shadow-lg w-[60rem] p-6"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Settings</h2>
                <button
                    className="p-2 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>
            <div className="flex">
                {/* Sidebar with Vertical Tabs */}
                <div className="flex flex-col border-r border-gray-200 dark:border-gray-700">
                    {settingsTabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center px-2 py-2 text-sm font-medium transition-all duration-300 ${activeTab === tab.name
                                ? "text-blue-600 border-l-4 border-blue-600 dark:text-blue-400"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                            aria-current={activeTab === tab.name ? "page" : undefined}
                        >
                            {tab.icon}
                            <span className="ml-2">{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="w-auto ml-2">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800 dark:border-white"></div>
                            </div>
                        }
                    >
                        {settingsTabs.map(
                            (tab) =>
                                activeTab === tab.name && (
                                    <div key={tab.name} className="text-gray-800 dark:text-gray-600">
                                        <tab.component />
                                    </div>
                                )
                        )}
                    </Suspense>
                </div>


            </div>


        </Modal>
    );
};

export default SettingsModal;
