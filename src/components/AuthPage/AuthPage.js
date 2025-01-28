import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import "./AuthPage.css";

const AuthPage = () => {
  const [page, setPage] = useState("signup"); // Default is "signup"

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
