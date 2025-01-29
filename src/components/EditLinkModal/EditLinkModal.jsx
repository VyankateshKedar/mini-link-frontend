// src/components/EditLinkModal/EditLinkModal.jsx
import React, { useState, useEffect } from "react";
import styles from "./EditLinkModal.module.css";
import { updateLink } from "../../utils/api";
import { toast } from "react-toastify";

const EditLinkModal = ({ isOpen, onClose, link, onLinkUpdated }) => {
  const [formData, setFormData] = useState({
    destinationUrl: "",
    remarks: "",
    shortCode: "",
    expiration: "",
  });

  useEffect(() => {
    if (link) {
      setFormData({
        destinationUrl: link.destinationUrl || "",
        remarks: link.remarks || "",
        shortCode: link.shortCode || "",
        expiration: link.expiration
          ? new Date(link.expiration).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [link]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { destinationUrl, remarks, shortCode, expiration } = formData;

      // Basic validation
      if (!destinationUrl.trim() || !remarks.trim()) {
        toast.error("Destination URL and Remarks are required.");
        return;
      }

      const updatedData = {
        destinationUrl,
        remarks,
        shortCode,
        expiration: expiration ? new Date(expiration).toISOString() : null,
      };

      const response = await updateLink(link._id, updatedData);
      if (response.success) {
        toast.success("Link updated successfully!");
        onLinkUpdated(response.link);
        onClose();
      } else {
        toast.error(response.message || "Failed to update link.");
      }
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("An error occurred while updating the link.");
    }
  };

  const handleClear = () => {
    setFormData({
      destinationUrl: "",
      remarks: "",
      shortCode: "",
      expiration: "",
    });
  };

  if (!isOpen || !link) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Edit Link</h2>
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
            placeholder="https://example.com"
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleChange}
            required
          />

          <label className={styles.fieldLabel}>
            Remarks <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Add remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            required
          />

          <label className={styles.fieldLabel}>
            Short Code
          </label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="6-8 alphanumeric characters"
            name="shortCode"
            value={formData.shortCode}
            onChange={handleChange}
          />

          <label className={styles.fieldLabel}>
            Link Expiration
          </label>
          <input
            type="datetime-local"
            className={styles.textInput}
            name="expiration"
            value={formData.expiration}
            onChange={handleChange}
          />

          {/* Footer (buttons) */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
            >
              Clear
            </button>
            <button type="submit" className={styles.updateBtn}>
              Update Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLinkModal;
