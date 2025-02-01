// src/components/ProtectedRoute/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * @param {object} props - React props
 * @param {JSX.Element} props.children - The component to render if authenticated
 * @returns {JSX.Element} - Rendered component or redirect
 */
const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated
   const isAuthenticated = !!sessionStorage.getItem("token"); // Adjust based on your auth logic

  if (!isAuthenticated) {
    // If not authenticated, redirect to AuthPage (login)
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the desired component
  return children;
};

export default ProtectedRoute;
