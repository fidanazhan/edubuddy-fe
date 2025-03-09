import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdDashboard, MdAdd, MdOutlineSearch } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoChatboxSharp } from "react-icons/io5";
import { CiChat1, CiTrash } from "react-icons/ci";
import Location from '../Location'
import { useTranslation } from "react-i18next";
// import './sidebar.css'

const Sidebar = ({ passIsOpen }) => {
  const [isOpen, setIsOpen] = useState(true); // For toggling the sidebar
  const [isMobileOpen, setIsMobileOpen] = useState(false); // For mobile devices
  const { t, ready } = useTranslation("sidebar");
  // const [chats, setChats] = useState([]);
  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");

  const queryClient = useQueryClient();
  // const { isPending, error, data } = useQuery({
  //   queryKey: ["userChats"],
  //   queryFn: () =>
  //     fetch(`${import.meta.env.VITE_API_URL}/api/chats/userchats?userId=user_2rzHVJFMuvGHRd07bO8oT0FzX4o`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }).then((res) => res.json()),
  // });

  // useEffect(() => {
  //   fetchChats()
  // }, []);

  // const fetchChats = async () => {
  //   const response = await fetch(`http://localhost:5000/api/chats/userchats`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${token}`,
  //       "x-tenant": subdomain,
  //     },
  //   });
  //   if (response.ok) {
  //     const data = await response.json()
  //     setChats(data)
  //   }
  // }

  const { data: chats, isLoading, isError } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/chats/userchats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-tenant": subdomain,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch chats");
      return response.json();
    },
  });

  // const deleteChat = async (chatId) => {
  //   const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${token}`,
  //       "x-tenant": subdomain,
  //     },
  //   });
  //   if (response.ok) {
  //     setChats((prevChats) => prevChats.filter(chat => chat._id !== chatId));
  //     fetchChats();
  //   }
  // }

  const deleteChat = async (chatId) => {
    const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-tenant": subdomain,
      },
    });
    if (response.ok) {
      queryClient.invalidateQueries(["userChats"]); // Force refetch after deleting
    }
  };


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // setGlobalIsOpen(!isOpen); // Pass updated state to parent component if provided
    passIsOpen(!isOpen)
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  function capitalizeAndTruncate(input) {
    if (!input) return "";

    const words = input
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

    const truncatedByWords = words.slice(0, 4).join(" ");

    return truncatedByWords.length > 20
      ? truncatedByWords.slice(0, 20).trim() + "..."
      : truncatedByWords;
  }

  if (!ready) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`h-screen border-r transition-all duration-300 
          ${isOpen ? "w-64" : "w-14"} 
          fixed top-0 left-0 z-10 hidden lg:flex flex-col
          bg-slate-100 dark:bg-gray-600 dark:border-gray-900`}
      >
        {/* Header Section with Toggle Button */}
        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none text-xl text-stone-500 dark:text-gray-300"
          >
            <FaBars />
          </button>
          <span
            className={`font-bold text-lg transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"
              }`}
          >
          </span>
        </div>

        {/* Menu Items */}
        <ul className="flex-1 mt-4 ml-0">
          <Link className="mb-3" to="/dashboard">
            <div className="relative w-full">
              <button className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 flex items-center gap-2 w-full text-gray-900 dark:text-gray-300">
                <MdAdd className="text-xl flex-shrink-0" />
                <span
                  className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {t("chat")}
                </span>
              </button>
            </div>
          </Link>
          <Link className="mb-3" to="/workspace">
            <div className="relative w-full">
              <button className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 flex items-center gap-2 w-full text-gray-900 dark:text-gray-300">
                <MdDashboard className="text-xl flex-shrink-0" />
                <span
                  className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {t("workspace")}
                </span>
              </button>
            </div>
          </Link>
          <div className="relative w-full">
            <button className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 flex items-center gap-2 w-full text-gray-900 dark:text-gray-300">
              <MdOutlineSearch className="text-xl flex-shrink-0" />
              <span
                className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0"
                  }`}
              >
                {t("search")}
              </span>
            </button>
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out ${isOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"}`}
          >
            <div className="px-4 mt-3 mb-4 font-semibold text-gray-900 dark:text-gray-300">{t("recent")}</div>
            {Array.isArray(chats) ? (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className="flex justify-between items-center py-2 px-4 text-sm text-gray-600 font-semibold dark:text-gray-300/80"
                >
                  {/* Chat Link */}
                  <Link to={`/chats/${chat._id}`} className="flex items-center gap-2 flex-1">
                    <CiChat1 className="text-gray-500 mr-1 text-sm" strokeWidth={1} />
                    {capitalizeAndTruncate(chat.title)}
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteChat(chat._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <CiTrash size={18} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 px-4">No recent chats</p>
            )}
          </div>
        </ul>


        {/* Recent Chats Sections */}
        {/* <div className="chatList">
          <hr />

          <hr />
        </div> */}

        {/* Footer Section */}
        <div
          className={`p-4 text-sm text-gray-500 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* <Location /> */}
        </div>
      </div>


      {/* Mobile Sidebar */}
      <div>
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden bg-blue-600 text-white p-2 fixed top-2 left-2 z-50 rounded-full"
        >
          <FaBars className="text-xl" />
        </button>

        <div
          className={`h-screen bg-gray-100 border-r fixed top-0 left-0 z-40 transform transition-transform duration-300 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <span className="font-bold text-lg"></span>
            <button
              onClick={toggleMobileSidebar}
              className="focus:outline-none text-xl hidden lg:block"
            >
              <FaBars />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 mt-4">
            <li>
              <Link
                to="/"
                className="px-4 py-2 hover:bg-blue-100 flex items-center gap-2"
                onClick={toggleMobileSidebar} // Close on navigation
              >
                Dashboard
              </Link>
            </li>
          </ul>

          {/* Footer */}
          <div className="p-4 text-sm text-gray-500">© 2025 BordUp™</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
