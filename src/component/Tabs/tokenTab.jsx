import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const systemScreen = () => {
    const location = useLocation(); // Get the current route location
    const [activeTab, setActiveTab] = useState(null); // Default active tab

    useEffect(() => {
        // Sync activeTab with the current location
        if (location.pathname === '/admin-panel/token/users') {
            setActiveTab('users');
        } else if (location.pathname === '/admin-panel/token/transaction') {
            setActiveTab('transaction');
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
                            to="/admin-panel/token/users"
                            onClick={() => handleTabClick('users')}
                            className={`hover:text-blue-500 font-semibold ${activeTab === 'users' ? 'text-blue-600' : ''}`}
                        >
                            Users
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link
                            to="/admin-panel/token/transaction"
                            onClick={() => handleTabClick('transaction')}
                            className={`hover:text-blue-500 font-semibold ${activeTab === 'transaction' ? 'text-blue-600' : ''}`}
                        >
                            Transaction
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

export default systemScreen;
