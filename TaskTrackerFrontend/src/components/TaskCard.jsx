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

function TaskCard({ task, onOpen }) {
  return (
    <div
      className="task-card"
      onClick={() => onOpen(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(task);
      }}
    >
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`status-badge ${statusClass(task.status)}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <span className="task-hint">Click to view details</span>
      </div>
    </div>
  );
}

export default TaskCard;