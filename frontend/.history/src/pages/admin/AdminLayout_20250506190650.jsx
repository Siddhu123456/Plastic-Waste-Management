// Layout.jsx
import React from "react"
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    console.log(children)
  return (
    <div className="min-h-screen flex flex-col bg-ow dark:bg-dsc">
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
