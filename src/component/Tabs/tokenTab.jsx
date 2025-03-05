import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const systemScreen = () => {
    const location = useLocation(); // Get the current route location
    const [activeTab, setActiveTab] = useState(null); // Default active tab
    const { t, ready } = useTranslation("tabs");

    useEffect(() => {
        // Sync activeTab with the current location
        if (location.pathname === '/admin-panel/token/users') {
            setActiveTab('users');
        } else if (location.pathname === '/admin-panel/token/transaction') {
            setActiveTab('transaction');
        } else if (location.pathname === '/admin-panel/token/reqeust') {
            setActiveTab('request');
        }
    }, [location]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (!ready) return null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-44 bg-gray-50 p-4 border-r dark:bg-gray-800 dark:text-gray-300 dark:border-gray-900">
                <ul className='list-none'>
                    <li className="mb-4">
                        <Link
                            to="/admin-panel/token/users"
                            onClick={() => handleTabClick('users')}
                            className={`hover:text-blue-500 font-semibold ${activeTab === 'users' ? 'text-blue-600' : ''}`}
                        >
                            {t("admin.token.users")}
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link
                            to="/admin-panel/token/transaction"
                            onClick={() => handleTabClick('transaction')}
                            className={`hover:text-blue-500 font-semibold ${activeTab === 'transaction' ? 'text-blue-600' : ''}`}
                        >
                            {t("admin.token.transaction")}
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link
                            to="/admin-panel/token/request"
                            onClick={() => handleTabClick('request')}
                            className={`hover:text-blue-500 font-semibold ${activeTab === 'request' ? 'text-blue-600' : ''}`}
                        >
                            {t("admin.token.request")}
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="flex-1 p-6 dark:bg-gray-800 dark:text-white dark:border-gray-900">
                <Outlet />
            </div>
        </div>
    );
};

export default systemScreen;
