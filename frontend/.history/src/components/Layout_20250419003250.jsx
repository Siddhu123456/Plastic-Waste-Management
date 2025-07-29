// Layout.jsx
import React from "react"
import Footer from "./Footer";
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-ow dark:bg-dsc">
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
