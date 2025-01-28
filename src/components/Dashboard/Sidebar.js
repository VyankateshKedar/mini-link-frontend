import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">cuvette</div>
      <ul className="menu">
        <li className="menu-item active">Dashboard</li>
        <li className="menu-item">Links</li>
        <li className="menu-item">Analytics</li>
        <li className="menu-item">Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
