// src/components/SettingsPage/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import "./SettingsPage.css"; // Create appropriate CSS
import { updateProfile, deleteAccount } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user details
    const fetchUserDetails = async () => {
      try {
        const userData = await fetchUser();
        if (userData.success) {
          setUser({
            name: userData.data.name,
            email: userData.data.email,
          });
        } else {
          alert(userData.message || "Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("An error occurred while fetching user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(user.name, user.email);
      if (response.success) {
        alert("Profile updated successfully!");
        if (response.emailUpdated) {
          // If email was updated, log out the user
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteAccount();
      if (response.success) {
        alert("Account deleted successfully!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        alert(response.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting the account.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      // Implement password change API if backend supports it
      // If not, remove this section or implement accordingly
      alert("Password change functionality is not implemented yet.");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing the password.");
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {/* Profile Update Form */}
      <form className="profile-form" onSubmit={handleProfileUpdate}>
        <h3>Update Profile</h3>
        <label>
          Name:
          <input
            type="text"
            value={user.name}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>

      {/* Password Change Form (Optional) */}
      {/* Uncomment if backend supports password change */}
      {/* <form className="password-form" onSubmit={handlePasswordChange}>
        <h3>Change Password</h3>
        <label>
          Current Password:
          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmNewPassword: e.target.value,
              }))
            }
            required
          />
        </label>
        <button type="submit">Change Password</button>
      </form> */}

      {/* Delete Account */}
      <div className="delete-account-section">
        <h3>Delete Account</h3>
        <button className="delete-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
