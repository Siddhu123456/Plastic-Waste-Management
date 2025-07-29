// Layout.jsx
import React from "react"
import Sidebar from "../../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-ow dark:bg-dsc">
      <Sidebar />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
