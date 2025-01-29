// src/components/AuthPage/SignUpForm.jsx
import React, { useState } from "react";
import "./Form.css";
import { registerUser } from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // ... rest of the code

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Join us Today!</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email id"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      <p>
        Already have an account? <span onClick={() => navigate("/")}>Login</span>
      </p>
    </form>
  );
};

export default SignUpForm;
