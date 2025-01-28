import React, { useState, useEffect } from "react";
import NewLinkModal from "../NewLinkModal/NewLinkModal";
import styles from "./Links.module.css";

// Import icons
import { FiCopy, FiEdit2, FiTrash2 } from "react-icons/fi";

function Links() {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [createdMsg, setCreatedMsg] = useState("");

  useEffect(() => {
    fetchLinks();
    setCopyMsg("");
  }, [currentPage, searchTerm]);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const limit = 10;
      let url = `${process.env.REACT_APP_API_URL}/links?page=${currentPage}&limit=${limit}`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to fetch links");
        return;
      }

      const data = await response.json();
      setLinks(data.links);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLinkCreated = (newLink) => {
    fetchLinks();
    setCreatedMsg("Link created successfully!");
    setTimeout(() => setCreatedMsg(""), 1500);
    handleCloseModal();
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
          <li>Dashboard</li>
          <li className={styles.activeLink}>Links</li>
          <li>Analytics</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <header className={styles.topBar}>
            <div className={styles.greetingContainer}>
              <h2>Good morning, Sujith</h2>
              <span className={styles.date}>Tue, Jan 25</span>
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
              <div className={styles.userAvatar}>SU</div>
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
                    <td>{link.clicks?.length || 0}</td> {/* Updated Line */}
                    <td
                      style={{ color: isExpired ? "orange" : "green" }}
                    >
                      {isExpired ? "Inactive" : "Active"}
                    </td>
                    <td>
                      <button className={styles.actionBtn}>
                        <FiEdit2 size={16} />
                      </button>
                      <button className={styles.actionBtn}>
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

        {/* Toast Messages */}
        {copyMsg && <div className={styles.toast}>{copyMsg}</div>}
        {createdMsg && <div className={styles.toast}>{createdMsg}</div>}

        {/* New Link Modal */}
        <NewLinkModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLinkCreated={handleLinkCreated}
        />
      </main>
    </div>
  );
}

export default Links;
