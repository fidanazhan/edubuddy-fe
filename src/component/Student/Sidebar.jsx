import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdDashboard, MdAdd, MdOutlineSearch } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { IoChatboxSharp } from "react-icons/io5";
import { CiChat1 } from "react-icons/ci";
import Location from '../Location'

// import './sidebar.css'

const Sidebar = ({ passIsOpen }) => {
  const [isOpen, setIsOpen] = useState(true); // For toggling the sidebar
  const [isMobileOpen, setIsMobileOpen] = useState(false); // For mobile devices

  // const { isPending, error, data } = useQuery({
  //   queryKey: ["userChats"],
  //   queryFn: () =>
  //     fetch(`${import.meta.env.VITE_API_URL}/api/chats/userchats?userId=user_2rzHVJFMuvGHRd07bO8oT0FzX4o`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }).then((res) => res.json()),
  // });

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

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`h-screen bg-slate-100 border-r transition-all duration-300
        ${isOpen ? "w-64" : "w-14"}
        fixed top-0 left-0 z-10 hidden lg:flex flex-col`}
      >
        {/* Header Section with Toggle Button */}
        <div className="flex items-center justify-between p-4 bg-slate-100 text-white">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none text-xl text-stone-500"
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
            <button className="px-4 py-2 hover:bg-blue-100 flex items-center gap-2 w-full">
              <MdAdd className="text-xl flex-shrink-0" />
              <span
                className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                New Chat
              </span>
            </button>
          </div>
        </Link>
        <Link className="mb-3" to="/workspace">
          <div className="relative w-full">
            <button className="px-4 py-2 hover:bg-blue-100 flex items-center gap-2 w-full">
              <MdDashboard className="text-xl flex-shrink-0" />
              <span
                className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Workspace
              </span>
            </button>
          </div>
        </Link>
        <div className="relative w-full">
          <button className="px-4 py-2 hover:bg-blue-100 flex items-center gap-2 w-full">
            <MdOutlineSearch className="text-xl flex-shrink-0" />
            <span
              className={`transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Search
            </span>
          </button>
        </div>

          <hr />
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out ${isOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"}`}
          >
            <div className="px-4 mt-3 mb-4 font-semibold">Recent Chats</div>
            {/* <div className="list">
              {isPending
                ? "Loading..."
                : error
                  ? "Something went wrong!"
                  : data?.map((chat) => (
                    <Link to={`/chats/${chat._id}`} key={chat._id} className="py-2 px-4 text-sm flex items-center gap-2 text-gray-600 font-semibold">
                      <CiChat1 className="text-gray-500 mr-1 text-md" strokeWidth={1} />
                      {capitalizeAndTruncate(chat.title)}
                    </Link>
                  ))}
            </div> */}
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
