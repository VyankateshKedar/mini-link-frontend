import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaLink, FaChartLine, FaCog } from 'react-icons/fa';
import styles from "./Analytics.module.css";
import { toast } from "react-toastify";
import logo from '../assets/images/cuvette_logo.png'; // <-- your logo path

// Import your API helpers
import { getAllClicks, fetchCurrentUser } from "../../utils/api";

const Analytics = () => {
  // Store all click rows
  const [clickData, setClickData] = useState([]);
  // Store user’s name for “Good morning, …”
  const [userName, setUserName] = useState("User");
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Items (clicks) per page
  const [itemsPerPage] = useState(10);

  // On component load, fetch user + first page of clicks
  useEffect(() => {
    fetchUserName();
    fetchPageData(1);
  }, []);

  const fetchUserName = async () => {
    try {
      const response = await fetchCurrentUser();
      if (response.success) {
        setUserName(response.data.name || "User");
      }
    } catch (error) {
      console.error("Failed to fetch user name", error);
    }
  };

  // Helper to fetch a particular page of click data
  const fetchPageData = async (pageNumber) => {
    try {
      const res = await getAllClicks(pageNumber, itemsPerPage);
      if (res.success) {
        setClickData(res.data);      // an array of click objects
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages);
      } else {
        toast.error(res.message || "Failed to fetch analytics data.");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("An error occurred while fetching analytics.");
    }
  };

  // Page change
  const handlePageChange = (pageNumber) => {
    fetchPageData(pageNumber);
  };

  // Format a date/time for display
  const formatTimestamp = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.analyticsPage}>
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

      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Top header section */}
        <div className={styles.headerBar}>
          <h1>Good morning, {userName}</h1>
          <p>{/* You can set the current date here if you like, e.g. "Tue, Jan 25" */}</p>
          <div className={styles.actions}>
            <button className={styles.createBtn}>+ Create new</button>
            <input
              type="text"
              className={styles.searchBox}
              placeholder="Search by remarks"
            />
          </div>
        </div>

        {/* Table container */}
        <div className={styles.tableContainer}>
          <h2 className={styles.tableHeading}>Analytics</h2>
          <table className={styles.analyticsTable}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>ip address</th>
                <th>User Device</th>
              </tr>
            </thead>
            <tbody>
              {clickData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No clicks found
                  </td>
                </tr>
              ) : (
                clickData.map((click, index) => (
                  <tr key={index}>
                    <td>{formatTimestamp(click.clickedAt)}</td>
                    <td>{click.destinationUrl}</td>
                    <td>{click.shortUrl}</td>
                    <td>{click.ip}</td>
                    <td>{click.deviceType || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={pageNum === currentPage ? styles.activePage : ""}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
