import React, { useState, useEffect } from 'react';
import { TiCloudStorageOutline } from "react-icons/ti";
import { GiToken } from "react-icons/gi";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/JWTContext';
import api from '../../../api/axios'

const Dashboard = () => {
  const { t, ready } = useTranslation("workspace");
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useAuth();
  const subdomain = window.location.hostname.split(".")[0];

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {

      setTimeout(async () => {
        try {
          const response = await api.get(`/api/user/${user.id}`, {
            "x-tenant": subdomain,
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }, 1000);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 dark:bg-gray-800 dark:border-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
          <div className=''>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80 mb-4">{t("dashboard.widget_token")}</h2>
            {userInfo?.usedToken === undefined ? (
                <div className="flex flex-col items-center">
                    {/* Animated Spinner */}
                    <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                ) : (
                <p className="text-gray-500">{userInfo.usedToken}</p>
            )}
          </div>
          <TiCloudStorageOutline className='w-20 h-20 text-blue-500' />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between dark:bg-gray-900 dark:border-gray-800">
          <div className=''>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300/80 mb-4">{t("dashboard.widget_storage")}</h2>
            {userInfo?.usedStorage === undefined ? (
                <div className="flex flex-col items-center">
                    {/* Animated Spinner */}
                    <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                ) : (
                <p className="text-gray-500">{userInfo.usedStorage}</p>
            )}
          </div>
          <GiToken className='w-20 h-20 text-gray-400' />
        </div>

        {/* Widget 3 */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-gray-700">Widget 3</h2>
          <p className="text-gray-500 mt-4">Some content for Widget 3...</p>
        </div> */}

        {/* Widget 4 */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-gray-700">Widget 4</h2>
          <p className="text-gray-500 mt-4">Some content for Widget 4...</p>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
