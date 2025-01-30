// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage/AuthPage";
import Dashboard from "./components/Dashboard/Dashboard";
import LinksPage from "./components/Links/Links";
import Analytics from "./components/Analytics/Analytics"; 
import SettingsPage from "./components/SettingsPage/SettingsPage"; 
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Function to check if the user is authenticated
  const isAuthenticated = () => !!localStorage.getItem("token"); // Adjust based on your auth logic

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Root Path - AuthPage (Login/Signup) */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <AuthPage />
          }
        />

        {/* Dashboard - Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Links Page - Protected Route */}
        <Route
          path="/links"
          element={
            <ProtectedRoute>
              <LinksPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics Page - Protected Route */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Settings Page - Protected Route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route */}
        <Route
          path="*"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
