import { useState, useEffect } from "react";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setStatus(editingTask.status || "Pending");
      setTitleError("");
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setTitleError("");
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setTitleError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
    });

    if (!editingTask) {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <form className="task-form glass-card" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {editingTask ? "Edit Task" : "Add New Task"}
      </h2>

      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required-mark">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError("");
          }}
          placeholder="Enter task title"
          className={titleError ? "input-error" : ""}
        />
        {titleError && <span className="error-text">{titleError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
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

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;