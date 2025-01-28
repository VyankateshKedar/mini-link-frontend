import React, { useState } from "react";
import "./Form.css";
import { registerUser } from "../../utils/api";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const response = await registerUser(formData);
    if (response.success) {
      alert("User registered successfully!");
    } else {
      alert(response.message || "Error registering user");
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
        type="tel"
        name="mobile"
        placeholder="Mobile no."
        value={formData.mobile}
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
        Already have an account? <a href="#">Login</a>
      </p>
    </form>
  );
};

export default SignUpForm;
