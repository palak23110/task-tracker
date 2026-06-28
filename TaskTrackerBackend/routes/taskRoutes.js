const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET /api/tasks - Return all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// POST /api/tasks - Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      title,
      description,
      status,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// PUT /api/tasks/:id - Update an existing task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;