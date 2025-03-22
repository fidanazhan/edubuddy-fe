import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Workspace from "../../page/Student/Workspace";

const Layout = () => {
  const [selectedModel, setSelectedModel] = useState("Gemini AI");
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop: Sidebar is open by default
        setSidebarIsOpen(true);
      } else if (window.innerWidth >= 768) {
        // Tablet: Sidebar is closed by default (ml-14)
        setSidebarIsOpen(false);
      } else {
        // Mobile: Sidebar is closed by default (ml-0)
        setSidebarIsOpen(false);
      }
    };

    handleResize(); // Set initial state based on window size
    window.addEventListener("resize", handleResize); // Update state on window resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const passIsOpen = (isOpen) => {
    setSidebarIsOpen(isOpen);
  };

  return (
    <div className="flex bg-gray-50 h-screen">
      <Sidebar passIsOpen={passIsOpen} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out sm:ml-0
          ${sidebarIsOpen ? "lg:ml-64" : "lg:ml-14"} `}
      >
        <Header selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        <main className="p-4 bg-gray-50 flex-1 dark:bg-gray-800 dark:text-gray-300">
          <Outlet context={{ selectedModel, setSelectedModel }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
