import { lazy, Suspense, useState } from "react";
import Modal from "react-modal";
import { FaTimes, FaGlobe } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { IoMdClose } from "react-icons/io";

const Theme = lazy(() => import("./Theme"));
const Language = lazy(() => import("./Language"));

const SettingsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState(1);
    const { t, ready } = useTranslation("settings");

    const settingsTabs = [
        { id: 1, name: t("settings.theme.tab"), icon: <MdOutlineWbSunny />, component: Theme },
        { id: 2, name: t("settings.language.tab"), icon: <FaGlobe />, component: Language },
    ];

    if (!isOpen) return null; // Don't render if isOpen is false
    if (!ready) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose} // Required for accessibility
            contentLabel="Settings Modal"
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col z-[90] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-900 
                       w-[80%] lg:w-[60rem] h-96 md:h-96  sm:h-auto sm:max-h-[90vh] mt-[-50vh] lg:mt-0"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
        >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl lg:text-xl font-bold">{t("settings.title")}</h2>
                <button
                    className="text-white hover:text-gray-900 bg-red-500 p-1 rounded-md"
                    onClick={onClose}
                >
                <IoMdClose className="w-7 h-7 lg:w-5 lg:h-5" />
                </button>
            </div>
    
            {/* Main Content: Sidebar + Tab Content */}
            <div className="flex flex-grow md:flex-row sm:flex-col">
                {/* Sidebar with Vertical Tabs */}
                <div className="flex flex-col md:h-full border-r border-gray-200 dark:border-gray-700 sm:border-b sm:border-r-0">
                    {settingsTabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 text-md font-medium transition-all duration-300 
                                        ${activeTab === tab.id
                                            ? "text-blue-600 border-l-4 border-blue-500 dark:text-blue-500 md:border-l-4 sm:border-b-2"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                        }`}
                            aria-current={activeTab === tab.id ? "page" : undefined}
                        >
                            {tab.icon}
                            <span className="text-xl lg:text-base ml-2">{tab.name}</span>
                        </button>
                    ))}
                </div>
    
                {/* Tab Content */}
                <div className="p-4 flex-1">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800 dark:border-white"></div>
                            </div>
                        }
                    >
                        {settingsTabs.map(
                            (tab) =>
                                activeTab === tab.id && (
                                    <div key={tab.id} className="text-gray-800 dark:text-gray-300">
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
