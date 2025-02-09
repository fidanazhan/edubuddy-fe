import React from "react";

const StorageBar = ({ totalStorage, usedStorage }) => {
  const usedPercentage = (usedStorage / totalStorage) * 100;
  const availableStorage = totalStorage - usedStorage;

  return (
    <div className="w-full max-w-xs mx-auto p-2 bg-gray-50 rounded-lg">
      <div className="relative h-1 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500"
          style={{ width: `${usedPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-blue-500">Used: {usedStorage} GB</span>
        <span className="text-gray-900">Available: {availableStorage} GB</span>
      </div>
    </div>
  );
};

export default StorageBar;
