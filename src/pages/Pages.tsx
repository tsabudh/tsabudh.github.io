import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Cursor from "../components/Cursor";

function Pages() {
  return (
    <React.Fragment>
      <Cursor />
      <Navbar />
      <Outlet />
    </React.Fragment>
  );
}

export default Pages;
