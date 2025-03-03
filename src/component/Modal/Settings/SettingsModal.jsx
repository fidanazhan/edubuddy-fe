import { lazy, Suspense, useState } from "react";
import Modal from "react-modal";
import { FaTimes, FaGlobe } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";

const Theme = lazy(() => import("./Theme"));
const Language = lazy(() => import("./Language"));

const SettingsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("Theme");

    const settingsTabs = [
        { name: "Theme", icon: <MdOutlineWbSunny />, component: Theme },
        { name: "Language", icon: <FaGlobe />, component: Language },
    ];

    if (!isOpen) return null; // Don't render if isOpen is false

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose} // Required for accessibility
            contentLabel="Settings Modal"
            className="bg-white rounded-lg shadow-lg w-[60rem] h-96 p-6 flex flex-col dark:bg-gray-800 dark:text-gray-300 dark:border-gray-900"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Settings</h2>
                <button className="p-2 text-gray-600 hover:text-gray-800" onClick={onClose}>
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>

            {/* Main Content: Sidebar + Tab Content */}
            <div className="flex flex-grow">
                {/* Sidebar with Vertical Tabs */}
                <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
                    {settingsTabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center px-4 py-2 text-md font-medium transition-all duration-300 ${activeTab === tab.name
                                ? "text-blue-600 border-l-4 border-blue-500 dark:text-blue-500"
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
                <div className="p-4">
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
                                    <div key={tab.name} className="text-gray-800 dark:text-gray-300">
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
