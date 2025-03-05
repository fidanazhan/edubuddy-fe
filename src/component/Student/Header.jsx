import { useState, useEffect, useRef } from "react";
import { FaCogs } from "react-icons/fa";
import { MdLogout, MdAdminPanelSettings, MdKeyboardArrowLeft } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useAuth } from "../../context/JWTContext";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../Modal/Settings/SettingsModal";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const closeModal = () => setIsSettingModalOpen(false);

  const { t, ready } = useTranslation("settings");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  if (!ready) return null;

  return (
    <div className="flex items-center justify-end bg-gray-50 p-4 dark:bg-gray-800 dark:text-white">
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="focus:outline-none flex items-center"
        >
          {user?.photo ? (
            <img
              src={user.photo}
              alt="Profile Photo"
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <HiOutlineUserCircle className="text-2xl" />
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-50 border rounded shadow-lg z-10 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-900">
            <button
              className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                closeDropdown();
                setIsSettingModalOpen(true);
              }}
            >
              <FaCogs className="mr-2 text-gray-600" />
              <span>{t("settings.title")}</span>
            </button>

            {user?.roles === "ADMIN" && (
              <button
                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  closeDropdown();
                  navigate(`/admin-panel`);
                }}
              >
                <MdAdminPanelSettings className="mr-2 text-gray-600" />
                <span>{t("admin")}</span>
              </button>
            )}

            <button
              className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleLogout}
            >
              <MdLogout className="mr-2 text-gray-600" />
              <span>{t("logout")}</span>
            </button>
          </div>
        )}

        <SettingsModal
          isOpen={isSettingModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default Header;