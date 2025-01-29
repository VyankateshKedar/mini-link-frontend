// src/components/Analytics/AnalyticsPage.jsx
import React, { useState, useEffect } from "react";
import styles from "./AnalyticsPage.module.css";
import { fetchDashboardStats, fetchLinkAnalytics } from "../../utils/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";

const AnalyticsPage = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalClicks: 0,
    dateWiseClicks: [],
    deviceWiseClicks: {},
  });
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkAnalytics, setLinkAnalytics] = useState({
    totalClicks: 0,
    deviceSummary: {},
    browserSummary: {},
    osSummary: {},
    clicks: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [analyticsCurrentPage, setAnalyticsCurrentPage] = useState(1);
  const [analyticsTotalPages, setAnalyticsTotalPages] = useState(1);
  const limit = 10; // Number of items per page

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedLink) {
      fetchAnalytics(selectedLink._id, analyticsCurrentPage);
    }
  }, [selectedLink, analyticsCurrentPage]);

  const fetchStats = async () => {
    try {
      const data = await fetchDashboardStats();
      if (data.success) {
        setDashboardStats(data.data);
      } else {
        toast.error(data.message || "Failed to fetch dashboard statistics");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("An error occurred while fetching statistics.");
    }
  };

  const fetchAnalytics = async (id, page) => {
    try {
      const data = await fetchLinkAnalytics(id);
      if (data.success) {
        setLinkAnalytics({
          totalClicks: data.totalClicks,
          deviceSummary: data.deviceSummary,
          browserSummary: data.browserSummary,
          osSummary: data.osSummary,
          clicks: data.clicks,
        });
        setAnalyticsTotalPages(Math.ceil(data.clicks.length / limit));
      } else {
        toast.error(data.message || "Failed to fetch link analytics");
      }
    } catch (error) {
      console.error("Error fetching link analytics:", error);
      toast.error("An error occurred while fetching link analytics.");
    }
  };

  const handleSelectLink = (link) => {
    setSelectedLink(link);
    setAnalyticsCurrentPage(1); // Reset to first page
  };

  const handleBack = () => {
    setSelectedLink(null);
    setLinkAnalytics({
      totalClicks: 0,
      deviceSummary: {},
      browserSummary: {},
      osSummary: {},
      clicks: [],
    });
  };

  const paginatedClicks = linkAnalytics.clicks.slice(
    (analyticsCurrentPage - 1) * limit,
    analyticsCurrentPage * limit
  );

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>cuvette</div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/links">Links</Link>
          </li>
          <li className={styles.activeLink}>
            <Link to="/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {!selectedLink ? (
          // Dashboard Stats
          <div className={styles.statsContainer}>
            <h2>Analytics Dashboard</h2>
            <div className={styles.statsCards}>
              <div className={styles.card}>
                <h3>Total Clicks</h3>
                <p>{dashboardStats.totalClicks}</p>
              </div>
              <div className={styles.card}>
                <h3>Date-wise Clicks</h3>
                <ul>
                  {dashboardStats.dateWiseClicks.map((item, index) => (
                    <li key={index}>
                      {item.date} - {item.count}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.card}>
                <h3>Click Devices</h3>
                <ul>
                  {Object.entries(dashboardStats.deviceWiseClicks).map(
                    ([device, count], index) => (
                      <li key={index}>
                        {device} - {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* List of Links to view detailed analytics */}
            <div className={styles.linksList}>
              <h3>Your Links</h3>
              <ul>
                {dashboardStats.links?.map((link) => (
                  <li key={link._id}>
                    <span>{link.shortUrl}</span>
                    <button onClick={() => handleSelectLink(link)}>
                      View Analytics
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          // Detailed Link Analytics
          <div className={styles.linkAnalyticsContainer}>
            <button className={styles.backBtn} onClick={handleBack}>
              <FiArrowLeft size={20} /> Back to Analytics
            </button>
            <h2>Analytics for: {selectedLink.shortUrl}</h2>
            <div className={styles.analyticsSummary}>
              <div className={styles.card}>
                <h3>Total Clicks</h3>
                <p>{linkAnalytics.totalClicks}</p>
              </div>
              <div className={styles.card}>
                <h3>Device Summary</h3>
                <ul>
                  {Object.entries(linkAnalytics.deviceSummary).map(
                    ([device, count], index) => (
                      <li key={index}>
                        {device} - {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className={styles.card}>
                <h3>Browser Summary</h3>
                <ul>
                  {Object.entries(linkAnalytics.browserSummary).map(
                    ([browser, count], index) => (
                      <li key={index}>
                        {browser} - {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className={styles.card}>
                <h3>OS Summary</h3>
                <ul>
                  {Object.entries(linkAnalytics.osSummary).map(
                    ([os, count], index) => (
                      <li key={index}>
                        {os} - {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* Clicks Table */}
            <div className={styles.clicksTable}>
              <h3>Click Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>IP Address</th>
                    <th>Device</th>
                    <th>Browser</th>
                    <th>OS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClicks.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No clicks found
                      </td>
                    </tr>
                  )}
                  {paginatedClicks.map((click, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(click.clickedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>{click.ip}</td>
                      <td>{click.deviceType}</td>
                      <td>{click.browser}</td>
                      <td>{click.os}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {linkAnalytics.clicks.length > limit && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setAnalyticsCurrentPage(analyticsCurrentPage - 1)}
                  disabled={analyticsCurrentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: analyticsTotalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setAnalyticsCurrentPage(pageNumber)}
                      className={
                        pageNumber === analyticsCurrentPage ? styles.activePage : ""
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => setAnalyticsCurrentPage(analyticsCurrentPage + 1)}
                  disabled={analyticsCurrentPage === analyticsTotalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;
