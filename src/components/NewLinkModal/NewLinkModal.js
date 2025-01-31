// src/components/NewLinkModal/NewLinkModal.jsx
import React, { useState } from "react";
import styles from "./NewLinkModel.module.css";
import { createLink } from "../../utils/api";
import { toast } from "react-toastify";

function NewLinkModal({ isOpen, onClose, onLinkCreated }) {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!destinationUrl.trim() || !remarks.trim()) {
      toast.error("Please fill in Destination URL and Remarks!");
      return;
    }

    try {
      const payload = {
        destinationUrl,
        remarks,
        expiration: isExpirationEnabled ? expirationDate : null,
      };
      const response = await createLink(payload);
      if (response.success) {
        onLinkCreated(response.link);
        toast.success("Link created successfully!");
        // Reset fields
        setDestinationUrl("");
        setRemarks("");
        setIsExpirationEnabled(false);
        setExpirationDate("");
      } else {
        toast.error(response.message || "Error creating link");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the link.");
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
            required
          />

          <label className={styles.fieldLabel}>
            Remarks <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Add remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
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
