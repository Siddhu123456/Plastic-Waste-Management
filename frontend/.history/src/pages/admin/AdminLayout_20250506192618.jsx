import React from "react"
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex bg-ow dark:bg-dsc">
        <Sidebar />
      <main className="w-full">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
