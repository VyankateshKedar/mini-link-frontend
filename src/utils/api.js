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
    const token = sessionStorage.getItem("token");
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
    const token = sessionStorage.getItem("token");
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
    const token = sessionStorage.getItem("token");
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
    const token = sessionStorage.getItem("token");
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
    const token = sessionStorage.getItem("token");
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
    const token = sessionStorage.getItem("token");
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

// utils/api.js
export async function deleteLink(id) {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/links/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data; // Expecting { success: true/false, message: "...", ... }
  } catch (err) {
    console.error("deleteLink error:", err);
    return { success: false, message: err.message };
  }
}


// Fetch Dashboard Stats
export const fetchDashboardStats = async () => {
  try {
    const token = sessionStorage.getItem("token");
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
    const token = sessionStorage.getItem("token");
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
// getAllClicks helper (make sure `API_URL` is defined and your handleResponse is re-used)
export const getAllClicks = async (page = 1, limit = 10) => {
  try {
    const token = sessionStorage.getItem("token");
    const url = `${API_URL}/links/all-clicks?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
