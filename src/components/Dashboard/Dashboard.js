// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewLinkModal from "../NewLinkModal/NewLinkModal";
import { FaTachometerAlt, FaLink, FaChartLine, FaCog } from 'react-icons/fa';
import styles from "./Dashboard.module.css";
import logo from '../assets/images/cuvette_logo.png'; // <-- your logo path

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("User"); // Default name
  const [currentDate, setCurrentDate] = useState("");

  // For the small dropdown over the user avatar
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dashboard Stats
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceWiseClicks, setDeviceWiseClicks] = useState({
    Mobile: 0,
    Desktop: 0,
    Tablet: 0,
    Other: 0,
  });

  const navigate = useNavigate();

  // Fetch user details from the API
  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      // Update user's name
      if (data && data.data && data.data.name) {
        setUserName(data.data.name);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch dashboard statistics from the API
  const fetchDashboardStats = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/links/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setTotalClicks(data.data.totalClicks);
        setDateWiseClicks(data.data.dateWiseClicks);
        setDeviceWiseClicks(data.data.deviceWiseClicks);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    // Set current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);

    // Fetch user details and dashboard stats
    fetchUserDetails();
    fetchDashboardStats();
  }, []);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Callback to refresh stats after a new link is created
  const handleLinkCreated = () => {
    fetchDashboardStats();
  };

  // Toggle the profile dropdown
  const handleAvatarClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token"); // or localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  // Derive the first letter of the user's name, fallback to 'U'
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
      {/* Logo container */}
      <div className={styles.logo}>
        {/* Replace text with an <img> element */}
        <img src={logo} alt="Cuvette Logo" className={styles.logoImage} />
      </div>

      <ul className={styles.navLinks}>
        <li className={styles.activeLink}>
          <Link to="/">
            <FaTachometerAlt className={styles.icon} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/links">
            <FaLink className={styles.icon} />
            <span>Links</span>
          </Link>
        </li>
        <li>
          <Link to="/analytics">
            <FaChartLine className={styles.icon} />
            <span>Analytics</span>
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <FaCog className={styles.icon} />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.greetingContainer}>
            <h2>Good morning, {userName}</h2>
            <span className={styles.date}>{currentDate}</span>
          </div>

          <div className={styles.actions}>
            <button onClick={handleCreateNew} className={styles.createBtn}>
              + Create new
            </button>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by remarks"
            />

            {/* Avatar and dropdown */}
            <div className={styles.userAvatar} onClick={handleAvatarClick}>
              {avatarLetter}
            </div>
            {showProfileMenu && (
              <div className={styles.profileDropdown}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Stats */}
        <section className={styles.statsSection}>
          <h1 className={styles.totalClicksTitle}>
            Total Clicks{" "}
            <span className={styles.totalClicksNumber}>{totalClicks}</span>
          </h1>

          <div className={styles.cardsWrapper}>
            {/* Date-wise clicks */}
            <div className={styles.card}>
              <h3>Date-wise Clicks</h3>
              {dateWiseClicks.length > 0 ? (
                dateWiseClicks.map((item) => (
                  <div key={item.date} className={styles.barItem}>
                    <span className={styles.barLabel}>{item.date}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${(item.count / totalClicks) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={styles.barValue}>{item.count}</span>
                  </div>
                ))
              ) : (
                <p>No data available.</p>
              )}
            </div>

            {/* Click Devices */}
            <div className={styles.card}>
              <h3>Click Devices</h3>
              {Object.keys(deviceWiseClicks).length > 0 ? (
                Object.entries(deviceWiseClicks).map(([device, count]) => (
                  <div key={device} className={styles.barItem}>
                    <span className={styles.barLabel}>{device}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${(count / totalClicks) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={styles.barValue}>{count}</span>
                  </div>
                ))
              ) : (
                <p>No data available.</p>
              )}
            </div>
          </div>
        </section>

        {/* Popup/Modal */}
        <NewLinkModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLinkCreated={handleLinkCreated}
        />
      </main>
    </div>
  );
}

export default Dashboard;
