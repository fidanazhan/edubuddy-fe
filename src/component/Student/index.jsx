import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Workspace from "../../page/Student/Workspace";

const Layout = () => {
  const [selectedModel, setSelectedModel] = useState("Gemini AI");
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true)

  const passIsOpen = (isOpen) => {
    setSidebarIsOpen(isOpen)

  }
  
  return (
  <div className="flex bg-white h-screen">
    <Sidebar passIsOpen={passIsOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out 
              ${sidebarIsOpen ? "ml-64" : "ml-14"}`}
      > 
        <Header selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        <main className="p-4 bg-gray-50 flex-1 dark:bg-gray-800 dark:text-gray-300">
          <Outlet context={{ selectedModel, setSelectedModel }} />
        </main>
      </div>
  </div>

  )
};

export default Layout;
