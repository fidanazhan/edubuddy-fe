import React, { useState, useEffect } from 'react';
import { TiCloudStorageOutline } from "react-icons/ti";
import { GiToken } from "react-icons/gi";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/JWTContext';
import api from '../../api/axios'

const DashboardTab = () => {
  const { t, ready } = useTranslation("admin");
  const [admin, setAdmin] = useState(null);
  const { user } = useAuth();
  const subdomain = window.location.hostname.split(".")[0];

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {

      setTimeout(async () => {
        try {
          const response = await api.get(`/api/user/${user.id}`, {
            "x-tenant": subdomain,
          });
          setAdmin(response.data);
        } catch (error) {
          // console.error("Error fetching admin info:", error);
          setAdmin("Failed to get data")
        }
      }, 1000);
    } catch (error) {
      // console.error("Error fetching admin info:", error);
      setAdmin("Failed to get data")
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 dark:bg-gray-800 dark:border-gray-900">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
          <div className=''>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{t("dashboard.widget_token")}</h2>
            {admin?.usedToken === undefined ? (
              <div className="flex flex-col items-center">
                {/* Animated Spinner */}
                <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-gray-500">{admin.usedToken}</p>
            )}
          </div>
          <TiCloudStorageOutline className='w-20 h-20 text-blue-500' />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
          <div className=''>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{t("dashboard.widget_storage")}</h2>
            {admin?.usedStorage === undefined ? (
              <div className="flex flex-col items-center">
                {/* Animated Spinner */}
                <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-gray-500">{admin.usedStorage}</p>
            )}
          </div>
          <GiToken className='w-20 h-20 text-gray-400' />
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
