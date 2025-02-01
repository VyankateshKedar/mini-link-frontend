// src/components/AuthPage/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Update form state when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Send login request to backend
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // 2. Handle error responses (e.g., 401, 400)
      if (!res.ok) {
        const { message } = await res.json();
        toast.error(message || "Invalid credentials!");
        return;
      }

      // 3. Parse the JSON response
      const data = await res.json();

      // 4. Store the token in sessionStorage
      sessionStorage.setItem("token", data.token);

      // 5. Optionally store user details in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // 6. Redirect to dashboard
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>

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

      <button type="submit">Login</button>

      <p>
        Don't have an account?{" "}
        <span onClick={() => navigate("/signup")} className="clickable">
          SignUp
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
