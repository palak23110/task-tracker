import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskDetailsModal from "./components/TaskDetailsModal";
import DashboardStats from "./components/DashboardStats";
import Toast from "./components/Toast";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL + "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Unable to load tasks. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Keep the open modal's task data in sync after a refetch
  useEffect(() => {
    if (selectedTask) {
      const fresh = tasks.find((t) => t._id === selectedTask._id);
      if (fresh) {
        setSelectedTask(fresh);
      } else {
        setSelectedTask(null);
      }
    }
  }, [tasks, selectedTask]);

  const handleCreateTask = async (taskData) => {
    try {
      await axios.post(API_URL, taskData);
      await fetchTasks();
      showToast("Task created successfully", "success");
      return true;
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");
      showToast("Failed to create task", "error");
      return false;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await axios.put(`${API_URL}/${id}`, taskData);
      setEditingTask(null);
      await fetchTasks();
      showToast("Task updated successfully", "success");
      return true;
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Failed to update task. Please try again.");
      showToast("Failed to update task", "error");
      return false;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSelectedTask(null);
      await fetchTasks();
      showToast("Task deleted successfully", "success");
      return true;
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
      showToast("Failed to delete task", "error");
      return false;
    }
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      return handleUpdateTask(editingTask._id, taskData);
    }
    return handleCreateTask(taskData);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleOpenTask = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  // Modal's "Update" maps to the same update handler, but doesn't touch the inline edit form.
  // Returns a success boolean so the modal knows whether it's safe to close itself.
  const handleModalUpdate = async (id, taskData) => {
    try {
      await axios.put(`${API_URL}/${id}`, taskData);
      await fetchTasks();
      showToast("Task updated successfully", "success");
      return true;
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Failed to update task. Please try again.");
      showToast("Failed to update task", "error");
      return false;
    }
  };

  return (
    <div className="app">
      <div className="app-bg-glow app-bg-glow-1"></div>
      <div className="app-bg-glow app-bg-glow-2"></div>

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
        ))}
      </div>

      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="app-subtitle">Stay organized, stay on track</p>
      </header>

      <main className="app-main">
        <DashboardStats tasks={tasks} />

        <section className="form-section">
          <TaskForm
            onSubmit={handleFormSubmit}
            editingTask={editingTask}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        {error && <div className="error-banner">{error}</div>}

        <section className="list-section">
          <TaskList
            tasks={tasks}
            loading={loading}
            onOpenTask={handleOpenTask}
          />
        </section>
      </main>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={handleCloseModal}
          onUpdate={handleModalUpdate}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default App;