import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dsc">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 xl:ml-64">
        {/* Top bar with menu toggle */}
        <header className="bg-white shadow-sm z-10 xl:hidden">
          <div className="px-4 py-3 flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-2 text-gray-600 focus:outline-none"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">ShopAdmin</h1>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;