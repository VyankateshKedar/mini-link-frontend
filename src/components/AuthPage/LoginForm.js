import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send login request to backend
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // 2. If the server returns an error status (e.g., 401, 400), handle it
      if (!res.ok) {
        const { message } = await res.json();
        alert(message || "Invalid credentials!");
        return;
      }

      // 3. Parse the JSON response: typically, you'll get { token, user }
      const data = await res.json();
      // data might look like: 
      // {
      //   success: true,
      //   token: "JWT_TOKEN_STRING",
      //   user: { name: "Sujith", email: "...", ... }
      // }

      // 4. Store token and user details in localStorage (or sessionStorage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 5. Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong. Please try again later.");
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
        Don't have an account? <span>SignUp</span>
      </p>
    </form>
  );
};

export default LoginForm;
