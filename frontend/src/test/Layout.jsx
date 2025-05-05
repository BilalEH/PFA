import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/ui/NavBar";

const Layout = () => {
  return (
    <div>
      <NavBar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
