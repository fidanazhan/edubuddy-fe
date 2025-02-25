import { useState, useEffect, useRef } from "react";
import { FaCogs } from "react-icons/fa";
import { MdLogout, MdAdminPanelSettings, MdKeyboardArrowLeft } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useAuth } from "../../context/JWTContext";
import { FiChevronDown } from "react-icons/fi"; // Importing the chevron icon
import { useNavigate } from "react-router-dom";
// import SettingsModal from "../Modals/SettingModal";

const Header = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  useEffect(() => {
    // // Close dropdown when clicking outside
    // const handleClickOutside = (event) => {
    //   if (
    //     dropdownRef.current &&
    //     !dropdownRef.current.contains(event.target) &&
    //     !modalRef.current.contains(event.target)
    //   ) {
    //     setIsDropdownOpen(false);
    //     setIsModalOpen(false);
    //   }
    // };

    // document.addEventListener("mousedown", handleClickOutside);

    // // Cleanup the event listener
    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
  }, []);

  return (
    <div className="flex items-center justify-end bg-gray-50 p-4">
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
              <div className="absolute right-0 mt-2 w-48 bg-gray-50 border rounded shadow-lg z-10">
                <button
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={openModal}
                >
                  <FaCogs className="mr-2 text-gray-600" />
                  <span>Settings</span>
                </button>
                {/* <SettingsModal isOpen={isModalOpen} onClose={closeModal} ref={modalRef} /> */}

                {user?.roles === "ADMIN" && (
                  <button
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      closeDropdown();
                      navigate(`/admin-panel`);
                    }}
                  >
                    <MdAdminPanelSettings className="mr-2 text-gray-600" />
                    Admin Panel
                  </button>
                )}

                <button
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <MdLogout className="mr-2 text-gray-600" />
                  Logout
                </button>
              </div>
            )}
      </div>
    </div>
  );
};

export default Header;