// src/components/Analytics/Analytics.jsx

import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import styles from "./Analytics.module.css"; // Create corresponding CSS module
import { fetchDashboardStats, fetchLinkAnalytics } from "../../utils/api";
import { toast } from "react-toastify";
import EditLinkModal from "../EditLinkModal/EditLinkModal";

const Analytics = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalClicks: 0,
    dateWiseClicks: [],
    deviceWiseClicks: {},
    links: [], // Assuming the backend returns a list of links
  });
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkAnalytics, setLinkAnalytics] = useState({
    totalClicks: 0,
    deviceSummary: {},
    browserSummary: {},
    osSummary: {},
    clicks: [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

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

  const fetchAnalytics = async (id) => {
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
    fetchAnalytics(link._id);
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

  const handleEditLink = (link) => {
    setSelectedLink(link);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLink(null);
  };

  const handleLinkUpdated = () => {
    fetchStats();
    toast.success("Link updated successfully!");
    handleCloseEditModal();
  };

  return (
    <div className={styles.container}>
      <Navbar />
      {!selectedLink ? (
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
                  <div>
                    <button onClick={() => handleSelectLink(link)}>
                      View Analytics
                    </button>
                    <button onClick={() => handleEditLink(link)}>
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className={styles.linkAnalyticsContainer}>
          <button className={styles.backBtn} onClick={handleBack}>
            Back to Analytics
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
                {linkAnalytics.clicks.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No clicks found
                    </td>
                  </tr>
                )}
                {linkAnalytics.clicks.map((click, index) => (
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
        </div>
      )}

      {/* Edit Link Modal */}
      {selectedLink && (
        <EditLinkModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          link={selectedLink}
          onLinkUpdated={handleLinkUpdated}
        />
      )}
    </div>
  );

export default Analytics;
