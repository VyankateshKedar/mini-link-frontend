// src/utils/api.js
const API_URL = process.env.REACT_APP_API_URL;

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }
  return data;
};

// Register User
export const registerUser = async ({ name, email, password }) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Login User
export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Fetch Current User
export const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update Profile
export const updateProfile = async (name, email) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/auth/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete Account
export const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/auth/delete-account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Create Link
export const createLink = async ({ destinationUrl, remarks, expiration }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destinationUrl, remarks, expiration }),
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Fetch Links with Pagination and Search
export const fetchLinks = async (page, limit, search) => {
  try {
    const token = localStorage.getItem("token");
    let url = `${API_URL}/links?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update Link
export const updateLink = async (id, { destinationUrl, shortCode, expiration, remarks }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/links/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destinationUrl, shortCode, expiration, remarks }),
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete Link
export const deleteLink = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/links/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Fetch Dashboard Stats
export const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/links/dashboard/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Fetch Link Analytics
export const fetchLinkAnalytics = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/links/analytics/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
