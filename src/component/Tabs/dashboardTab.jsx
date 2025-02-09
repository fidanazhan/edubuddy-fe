import React from 'react';
import { TiCloudStorageOutline } from "react-icons/ti";
import { GiToken } from "react-icons/gi";

const DashboardTab = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
          <div className=''>
            <h2 className="text-xl font-semibold text-gray-700">Token Used</h2>
            <p className="text-gray-500 mt-4">1500/500000</p>
          </div>
          <TiCloudStorageOutline className='w-20 h-20 text-blue-500' />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
          <div className=''>
            <h2 className="text-xl font-semibold text-gray-700">Storage Used</h2>
            <p className="text-gray-500 mt-4">1.5kB/5MB</p>
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

export default DashboardTab;
