// src/components/Links/Links.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewLinkModal from "../NewLinkModal/NewLinkModal";
import EditLinkModal from "../EditLinkModal/EditLinkModal";
import styles from "./Links.module.css";
import { FiCopy, FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteLink as deleteLinkAPI, fetchLinks, fetchDashboardStats } from "../../utils/api";
import { toast } from "react-toastify";

function Links() {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    fetchLinkData();
  }, [currentPage, searchTerm]);

  const fetchLinkData = async () => {
    try {
      const data = await fetchLinks(currentPage, 10, searchTerm);
      if (data.success) {
        setLinks(data.links);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to fetch links");
      }
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("An error occurred while fetching links.");
    }
  };

  const handleCreateNew = () => {
    setIsNewModalOpen(true);
  };

  const handleCloseNewModal = () => {
    setIsNewModalOpen(false);
  };

  const handleLinkCreated = () => {
    fetchLinkData();
    toast.success("Link created successfully!");
    handleCloseNewModal();
  };

  const handleCopyLink = (shortUrl) => {
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => toast.error("Failed to copy link."));
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
    fetchLinkData();
    toast.success("Link updated successfully!");
    handleCloseEditModal();
  };

  const handleDeleteLink = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this link?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteLinkAPI(id);
      if (response.success) {
        toast.success("Link deleted successfully!");
        fetchLinkData();
      } else {
        toast.error(response.message || "Failed to delete link.");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("An error occurred while deleting the link.");
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>cuvette</div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={styles.activeLink}>
            <Link to="/links">Links</Link>
          </li>
          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <header className={styles.topBar}>
            <div className={styles.greetingContainer}>
              <h2>Good morning, {JSON.parse(localStorage.getItem("user")).name}</h2>
              <span className={styles.date}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className={styles.actions}>
              <button onClick={handleCreateNew} className={styles.createBtn}>
                + Create new
              </button>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search by remarks"
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchTerm(e.target.value);
                }}
              />
              <div className={styles.userAvatar}>
                {JSON.parse(localStorage.getItem("user")).name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            </div>
          </header>
        </div>

        {/* Links Table */}
        <section className={styles.tableSection}>
          <table className={styles.linksTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>Remarks</th>
                <th>Clicks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No links found
                  </td>
                </tr>
              )}
              {links.map((link) => {
                const isExpired =
                  link.expiration && new Date(link.expiration) < new Date();
                return (
                  <tr key={link._id}>
                    <td>{formatDate(link.createdAt)}</td>
                    <td>
                      <a
                        href={link.destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.destinationUrl}
                      </a>
                    </td>
                    <td>
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.shortUrl}
                      </a>{" "}
                      <button
                        className={styles.copyBtn}
                        onClick={() => handleCopyLink(link.shortUrl)}
                      >
                        <FiCopy size={14} />
                      </button>
                    </td>
                    <td>{link.remarks || "-"}</td>
                    <td>{link.clicks?.length || 0}</td>
                    <td style={{ color: isExpired ? "orange" : "green" }}>
                      {isExpired ? "Inactive" : "Active"}
                    </td>
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEditLink(link)}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDeleteLink(link._id)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

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

        {/* Toast Messages are handled globally by react-toastify */}

        {/* New Link Modal */}
        <NewLinkModal
          isOpen={isNewModalOpen}
          onClose={handleCloseNewModal}
          onLinkCreated={handleLinkCreated}
        />

        {/* Edit Link Modal */}
        <EditLinkModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          link={selectedLink}
          onLinkUpdated={handleLinkUpdated}
        />
      </main>
    </div>
  );
}

export default Links;
