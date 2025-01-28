import React, { useState } from "react";
import styles from "./NewLinkModel.module.css";

function NewLinkModal({ 
  isOpen, 
  onClose, 
  onLinkCreated 
}) {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!destinationUrl.trim() || !remarks.trim()) {
      alert("Please fill in Destination URL and Remarks!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/links`, {
        method: "POST",
        headers: {
          // IMPORTANT: If you use JWT-based auth, include an Authorization header
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationUrl,
          remarks,
          expiration: isExpirationEnabled ? expirationDate : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error creating link");
        return;
      }

      const result = await response.json();
      // result might look like: { success: true, data: { shortUrl: "http://...", etc. } }

      // Notify parent to refresh the dashboard or analytics
      onLinkCreated(result.data);

      // Close modal & reset fields
      onClose();
      setDestinationUrl("");
      setRemarks("");
      setIsExpirationEnabled(false);
      setExpirationDate("");
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the link.");
    }
  };

  const handleClear = () => {
    setDestinationUrl("");
    setRemarks("");
    setIsExpirationEnabled(false);
    setExpirationDate("");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>New Link</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <label className={styles.fieldLabel}>
            Destination Url <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="https://web.whatsapp.com/"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
          />

          <label className={styles.fieldLabel}>
            Remarks <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Add remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <div className={styles.expirationRow}>
            <label className={styles.fieldLabel}>Link Expiration</label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isExpirationEnabled}
                onChange={() => setIsExpirationEnabled(!isExpirationEnabled)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {isExpirationEnabled && (
            <div className={styles.dateInputWrapper}>
              <input
                type="datetime-local"
                className={styles.textInput}
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          )}

          {/* Footer (buttons) */}
          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.clearBtn} 
              onClick={handleClear}
            >
              Clear
            </button>
            <button type="submit" className={styles.createBtn}>
              Create new
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewLinkModal;
