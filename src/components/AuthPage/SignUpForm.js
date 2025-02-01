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

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Call the registerUser API
      const response = await registerUser(formData);

      if (response.success) {
        toast.success("Registration successful");
        // Redirect to the login page after successful registration
        navigate("/login");
      } else {
        // If the API returns an error message
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      // In case the API call fails
      toast.error("An error occurred during registration");
      console.error("Registration error:", error);
    }
  };

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
        Already have an account?{" "}
        <span className="clickable" onClick={() => navigate("/")}>
          Login
        </span>
      </p>
    </form>
  );
};

export default SignUpForm;
