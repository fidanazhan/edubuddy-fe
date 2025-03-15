import { useState, useEffect, useRef } from "react";
import { chatEvents } from "../../page/Student/eventEmitter";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdDashboard, MdAdd, MdOutlineSearch } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoChatboxSharp } from "react-icons/io5";
import { CiChat1, CiTrash, CiMenuKebab } from "react-icons/ci";
import { RiPencilLine } from "react-icons/ri";
import Location from '../Location'
import { useTranslation } from "react-i18next";
import { format, isToday, isYesterday, subDays, isAfter } from "date-fns";

import ChatModal from "../Admin/ChatModal";

const Sidebar = ({ passIsOpen }) => {
  const [isOpen, setIsOpen] = useState(true); // For toggling the sidebar
  const [isMobileOpen, setIsMobileOpen] = useState(false); // For mobile devices
  const { t, ready } = useTranslation("sidebar");
  const subdomain = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");
  const queryClient = useQueryClient();
  const [isChatModelOpen, setIsChatModelOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null)

  const { data: chats, isLoading, isError, refetch } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/chats/userchats`, {
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
    staleTime: Infinity,         // Data never becomes stale
    refetchInterval: false,      // Disables automatic polling
    refetchOnWindowFocus: false, // Prevents refetching on tab focus
    refetchOnReconnect: false,   // Prevents refetching on network reconnect
  });

  useEffect(() => {
    const refreshHandler = () => refetch();
    chatEvents.on("refreshChats", refreshHandler);

    return () => {
      chatEvents.off("refreshChats", refreshHandler);
    };
  }, [refetch]);

  const deleteChat = async (chatId) => {
    const response = await fetch(import.meta.env.VITE_API_URL + `/api/chats/${chatId}`, {
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

  const groupChatsByDate = (chats) => {
    if (!Array.isArray(chats)) return { Today: [], Yesterday: [], "Last 7 Days": [] };
  
    const today = new Date();
    const yesterday = subDays(today, 1);
    const sevenDaysAgo = subDays(today, 7);
  
    const groupedChats = {
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
    };
  
    chats.forEach((chat) => {
      const updatedAt = new Date(chat.updatedAt);
  
      if (isToday(updatedAt)) {
        groupedChats.Today.push(chat);
      } else if (isYesterday(updatedAt)) {
        groupedChats.Yesterday.push(chat);
      } else if (isAfter(updatedAt, sevenDaysAgo)) {
        groupedChats["Last 7 Days"].push(chat);
      }
    });
  
    return groupedChats;
  };
  

  const groupedChats = groupChatsByDate(chats);

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
            className={`custom-scrollbar custom-scrollbar-sidebar-height whitespace-nowrap transition-all duration-200 ease-in-out overflow-y-auto max-h-60 ${isOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"
              }`}
          >
            <div className="px-4 mt-3 mb-3 font-semibold text-gray-900 dark:text-gray-300">
              {t("recent")}
            </div>

            {Object.values(groupedChats).flat().length > 0 ? (
              Object.entries(groupedChats).map(([dateGroup, chats]) =>
                chats.length > 0 ? (
                  <div key={dateGroup}>
                    <h2 className="text-gray-700 dark:text-gray-300 font-bold px-4 py-2">{dateGroup}</h2>
                    {chats.map((chat) => (
                      <div
                        key={chat._id}
                        className="flex justify-between items-center py-2 px-4 text-sm text-gray-600 font-semibold dark:text-gray-300/80 relative"
                      >
                        {/* Chat Title aligned to the left */}
                        <Link to={`/chats/${chat._id}`} className="flex items-center gap-2 flex-grow">
                          <CiChat1 className="text-gray-500 mr-1 text-sm" strokeWidth={1} />
                          {capitalizeAndTruncate(chat.title)}
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedChat(chat);
                            setIsChatModelOpen(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <CiMenuKebab size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null
              )
            ) : (
              <p className="text-gray-500 px-4">No recent chats</p>
            )}

          </div>

        </ul >
        {/* Footer Section */}
        < div
          className={`p-4 text-sm text-gray-500 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"
            }`
          }
        >
          {/* <Location /> */}
        </div >
      </div >


      {/* Mobile Sidebar */}
      < div >
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden bg-blue-600 text-white p-2 fixed top-2 left-2 z-50 rounded-full"
        >
          <FaBars className="text-xl" />
        </button>
        <div
          className={`h-screen bg-slate-100 dark:bg-gray-600 dark:border-gray-900 border-r fixed top-0 left-0 z-40 transform transition-transform duration-300 
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
          <ul className="flex-1 mt-4 ml-0">
            <Link className="mb-3" to="/dashboard">
              <div className="relative w-full">
                <button className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 flex items-center gap-2 w-full text-gray-900 dark:text-gray-300">
                  <MdAdd className="text-xl flex-shrink-0" />
                  <span
                    className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${isMobileOpen ? "opacity-100" : "opacity-0"
                      } `}
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
                    className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${isMobileOpen ? "opacity-100" : "opacity-0"
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
                  className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${isMobileOpen ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {t("search")}
                </span>
              </button>
            </div>

            <hr className="border-gray-300 dark:border-gray-700" />
            <div
              className={`custom-scrollbar custom-scrollbar-sidebar-height whitespace-nowrap transition-all duration-200 ease-in-out overflow-y-auto max-h-60 ${isMobileOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"
                }`}
            >
              <div className="px-4 mt-3 mb-4 font-semibold text-gray-900 dark:text-gray-300">
                {t("recent")}
              </div>
              {Array.isArray(chats) ? (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    className="flex justify-between items-center py-2 px-4 text-sm text-gray-600 font-semibold dark:text-gray-300/80 relative"
                  >
                    {/* Chat Title aligned to the left */}
                    <Link to={`/chats/${chat._id}`} className="flex items-center gap-2 flex-grow">
                      <CiChat1 className="text-gray-500 mr-1 text-sm" strokeWidth={1} />
                      {capitalizeAndTruncate(chat.title)}
                    </Link>

                    {/* Delete button aligned to the right */}
                    <button
                      onClick={() => deleteChat(chat._id)}
                      className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full"
                    >
                      <CiTrash className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 px-4">No recent chats</p>
              )}
            </div>

          </ul >

          {/* Footer */}
          <div className="p-4 text-sm text-gray-500">© 2025 BordUp™</div>
        </div>
      </div >

      {isChatModelOpen && selectedChat && (
        <ChatModal
          title={t("admin:users.user.bulk_update")}
          onClose={() => setIsChatModelOpen(false)}
          initialValues={selectedChat}
          onSubmit={() => {setIsChatModelOpen(false)}}
          token={token}
          subdomain = {subdomain}
          refetch = {refetch}
        />
      )}

    </>
  );
};

export default Sidebar;
