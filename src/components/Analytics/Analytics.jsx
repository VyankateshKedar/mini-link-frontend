// src/components/Analytics/Analytics.jsx
import React, { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import { FiCopy } from "react-icons/fi";

function Analytics() {
  const [clicks, setClicks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClicks();
  }, [currentPage]);

  const fetchClicks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const limit = 20;
      const url = `http://localhost:5000/api/links/analytics?page=${currentPage}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to fetch analytics data");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setClicks(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      alert("An error occurred while fetching analytics data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (shortUrl) => {
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => {
        setCopyMsg("Link Copied");
        setTimeout(() => setCopyMsg(""), 1500);
      })
      .catch(() => alert("Failed to copy link"));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>cuvette</div>
        <ul className={styles.navLinks}>
          <li>Dashboard</li>
          <li>Links</li>
          <li className={styles.activeLink}>Analytics</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Analytics</h2>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading analytics data...</div>
        ) : (
          <section className={styles.tableSection}>
            <table className={styles.analyticsTable}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>IP Address</th>
                  <th>Device Type</th>
                  <th>Browser</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clicks.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No analytics data available.
                    </td>
                  </tr>
                )}
                {clicks.map((click, index) => (
                  <tr key={index}>
                    <td>{formatDate(click.clickedAt)}</td>
                    <td>
                      <a
                        href={click.destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {click.destinationUrl}
                      </a>
                    </td>
                    <td>
                      <a
                        href={click.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {click.shortUrl}
                      </a>{" "}
                      <button
                        className={styles.copyBtn}
                        onClick={() => handleCopyLink(click.shortUrl)}
                      >
                        <FiCopy size={14} />
                      </button>
                    </td>
                    <td>{click.ip || "-"}</td>
                    <td>{click.deviceType || "-"}</td>
                    <td>{click.browser || "-"}</td>
                    <td>
                      {/* Future Actions: Edit/Delete if needed */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={
                    pageNumber === currentPage ? styles.activePage : ""
                  }
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}

        {/* Toast Messages */}
        {copyMsg && <div className={styles.toast}>{copyMsg}</div>}
      </main>
    </div>
  );
}

export default Analytics;
