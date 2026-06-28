function DashboardStats({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  const stats = [
    { label: "Total Tasks", value: total, className: "stat-total" },
    { label: "Pending", value: pending, className: "stat-pending" },
    { label: "In Progress", value: inProgress, className: "stat-progress" },
    { label: "Completed", value: completed, className: "stat-completed" },
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat) => (
        <div key={stat.label} className={`stat-card ${stat.className}`}>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;