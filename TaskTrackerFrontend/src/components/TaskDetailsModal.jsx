import { useState, useEffect } from "react";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

function statusClass(status) {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "In Progress":
      return "status-progress";
    case "Completed":
      return "status-completed";
    default:
      return "";
  }
}

function formatDate(dateString) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TaskDetailsModal({ task, onClose, onUpdate, onDelete }) {
  const [mode, setMode] = useState("view"); // "view" | "edit"
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "Pending");
  const [titleError, setTitleError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset local edit state whenever a different task is opened
  useEffect(() => {
    setMode("view");
    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus(task.status || "Pending");
    setTitleError("");
    setConfirmingDelete(false);
  }, [task]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    setSaving(true);
    const success = await onUpdate(task._id, {
      title: title.trim(),
      description: description.trim(),
      status,
    });
    setSaving(false);

    // Only return to the main task list once the update is confirmed —
    // on failure, stay on the edit screen so the user can retry.
    if (success) {
      onClose();
    }
  };

  const handleDeleteConfirmed = () => {
    onDelete(task._id);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content glass-card">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {mode === "view" ? (
          <>
            <div className="modal-header">
              <h2 className="modal-title">{task.title}</h2>
              <span className={`status-badge ${statusClass(task.status)}`}>
                {task.status}
              </span>
            </div>

            <div className="modal-section">
              <span className="modal-label">Description</span>
              <p className="modal-description">
                {task.description ? task.description : "No description provided."}
              </p>
            </div>

            <div className="modal-section">
              <span className="modal-label">Created</span>
              <p className="modal-meta">{formatDate(task.createdAt)}</p>
            </div>

            {confirmingDelete ? (
              <div className="modal-confirm-delete">
                <p>Are you sure you want to delete this task?</p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirmed}
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setMode("edit")}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        ) : (
          <form className="modal-edit-form" onSubmit={handleSave}>
            <h2 className="modal-title">Edit Task</h2>

            <div className="form-group">
              <label htmlFor="modal-title">
                Title <span className="required-mark">*</span>
              </label>
              <input
                id="modal-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError("");
                }}
                className={titleError ? "input-error" : ""}
              />
              {titleError && <span className="error-text">{titleError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="modal-description">Description</label>
              <textarea
                id="modal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-status">Status</label>
              <select
                id="modal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMode("view")}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TaskDetailsModal;