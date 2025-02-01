// src/components/AuthPage/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import "./AuthPage.css";

const AuthPage = () => {
  const location = useLocation();

  // Set the initial page based on the URL: if the pathname is "/login" use "login", otherwise default to "signup"
  const getInitialPage = () => (location.pathname === "/login" ? "login" : "signup");
  const [page, setPage] = useState(getInitialPage);

  // Update the page state if the location changes.
  useEffect(() => {
    setPage(getInitialPage());
  }, [location.pathname]);

  return (
    <div className="auth-page">
      <Navbar setPage={setPage} page={page} />
      <div className="content">
        <div className="image-side">
          <img
            src="../cuvette.png"
            alt="Background"
            className="background-image"
          />
          <div className="logo">
            <h1>cuvette</h1>
          </div>
        </div>
        <div className="form-side">
          {page === "signup" ? <SignUpForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
