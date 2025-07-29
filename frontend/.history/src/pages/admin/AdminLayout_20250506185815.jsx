// Layout.jsx
import React from "react"
import Sidebar from "../../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-ow dark:bg-dsc">
      <main>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
