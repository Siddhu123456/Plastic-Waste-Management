// Layout.jsx
import React from "react"
import Footer from "./Footer";
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ow dark:bg-dsc">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
