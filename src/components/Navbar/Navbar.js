import React from "react";
import "./Navbar.css";

const Navbar = ({ setPage, page }) => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <button
          className={page === "signup" ? "active" : ""}
          onClick={() => setPage("signup")}
        >
          SignUp
        </button>
        <button
          className={page === "login" ? "active" : ""}
          onClick={() => setPage("login")}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
