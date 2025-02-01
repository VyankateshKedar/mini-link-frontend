// src/components/AuthPage/SignUpForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Form.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Update form state when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle sign-up form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Handle non-OK responses
      if (!res.ok) {
        const { message } = await res.json();
        toast.error(message || "Registration failed!");
        return;
      }

      // Parse response data and store token/user details
      const data = await res.json();
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
        placeholder="Email"
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
        name="confirmpassword"
        placeholder="Confirm Password"
        value={formData.confirmpassword}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} className="clickable">
          Login
        </span>
      </p>
    </form>
  );
};

export default SignUpForm;
