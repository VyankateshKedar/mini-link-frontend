import React from "react";
import "./Header.css";

const Header = ({ name }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="header">
      <div className="greeting">
        <h2>Good morning, {name}</h2>
        <p>{today}</p>
      </div>
      <div className="header-actions">
        <button className="create-btn">+ Create New</button>
        <input
          type="text"
          placeholder="Search by remarks"
          className="search-bar"
        />
        <div className="profile-circle">{name ? name.charAt(0).toUpperCase() : "U"}</div>
      </div>
    </div>
  );
};

export default Header;
