import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewLinkModal from "../NewLinkModal/NewLinkModal";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("User"); // Default name
  const [currentDate, setCurrentDate] = useState("");

  // Dashboard Stats
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceWiseClicks, setDeviceWiseClicks] = useState({
    Mobile: 0,
    Desktop: 0,
    Tablet: 0,
    Other: 0,
  });

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserName(data.data.name); // Update user's name
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/links/dashboard/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

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

    // Set current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);

    fetchUserDetails();
    fetchDashboardStats();
  }, []);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Callback to refresh links after creation
  const handleLinkCreated = (newLinkData) => {
    // After a new link is created, fetch the dashboard stats again
    fetchDashboardStats();
  };

  // Fetch Dashboard Stats Again
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/links/dashboard/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>cuvette</div>
        <ul className={styles.navLinks}>
          <li className={styles.activeLink}>Dashboard</li>
          {/* Use React Router's Link to navigate to /links */}
          <li>
            <Link to="/links">Links</Link>
          </li>
          <li>
            <Link to="/analytics">Analytics</Link> {/* Added Analytics Link */}
          </li>
          <li>
            <Link to="/settings">Settings</Link> {/* Optional: Add Settings */}
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
            <div className={styles.userAvatar}>SU</div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <section className={styles.statsSection}>
          <h1 className={styles.totalClicksTitle}>
            Total Clicks <span className={styles.totalClicksNumber}>{totalClicks}</span>
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
                        style={{ width: `${(item.count / totalClicks) * 100}%` }}
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
                        style={{ width: `${(count / totalClicks) * 100}%` }}
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
