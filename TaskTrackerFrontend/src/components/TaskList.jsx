import { useState } from "react";
import TaskCard from "./TaskCard";

const FILTER_OPTIONS = [
  { label: "All Tasks", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

function TaskList({ tasks, loading, onOpenTask }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredTasks =
    statusFilter === "All"
      ? tasks || []
      : (tasks || []).filter((task) => task.status === statusFilter);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "az":
        return (a.title || "").localeCompare(b.title || "");
      case "za":
        return (b.title || "").localeCompare(a.title || "");
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="task-list-container">
      <div className="filter-section glass-card">
        <label htmlFor="status-filter" className="filter-label">
          Filter by status
        </label>
        <select
          id="status-filter"
          className="filter-dropdown"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="sort-tasks" className="filter-label">
          Sort by
        </label>
        <select
          id="sort-tasks"
          className="filter-dropdown"
          value={sortOption}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="state-message loading-state">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : !sortedTasks || sortedTasks.length === 0 ? (
        <div className="state-message empty-state">
          <p className="empty-icon">📋</p>
          <p>No tasks found.</p>
          <p className="empty-subtext">
            {statusFilter === "All"
              ? "Add a new task to get started!"
              : `No tasks with status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="task-grid">
          {sortedTasks.map((task) => (
            <TaskCard key={task._id} task={task} onOpen={onOpenTask} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;