import Task from "../models/taskModel.js";
import mongoose from "mongoose";

//Add task : /api/task/add
export const addTask = async (req, res) => {
  try {
    const userId = req.userId;

    const { title, description, dueDate, priority, category } = req.body;

    if (!title) {
      return res.json({ success: false, message: "Add title to add a task!" });
    }

    const allowedPriorities = ["low", "medium", "high"];

    const taskData = {
      user: userId,
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: allowedPriorities.includes(priority) ? priority : "low",
      status: "pending",
      category: category ? String(category).trim().toLowerCase() : "general",
      dueDate: null,
    };

    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d)) taskData.dueDate = d;
      else
        return res
          .status(400)
          .json({ success: false, message: "Invalid due date" });
    }

    const task = await Task.create(taskData);

    return res.json({
      success: true,
      message: "Task Added Successfully",
      task,
    });
  } catch (error) {
    console.error("addTask error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Edit task : /api/task/:id
export const editTask = async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task id" });
    }

    const { title, description, dueDate, priority, category } = req.body;

    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (title !== undefined) {
      const t = String(title).trim();
      if (!t)
        return res
          .status(400)
          .json({ success: false, message: "Title cannot be empty" });
      task.title = t;
    }

    // Description
    if (description !== undefined) {
      task.description = String(description).trim();
    }

    const ALLOWED_PRIORITIES = ["low", "medium", "high"];

    if (priority !== undefined) {
      if (priority === "" || priority === null) {
        task.priority = "low";
      } else if (!ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Priority must be one of: low, medium, high",
        });
      } else {
        task.priority = priority;
      }
    }

    if (dueDate !== undefined) {
      if (dueDate === "" || dueDate === null) {
        // If user clears the due date
        task.dueDate = null;
      } else {
        const d = new Date(dueDate);
        if (isNaN(d)) {
          return res.json({ success: false, message: "Invalid due date" });
        }
        task.dueDate = d;
      }
    }

    if (category !== undefined) {
      const c = String(category).trim().toLowerCase();
      task.category = c || "general";
    }

    await task.save();

    return res.json({
      success: true,
      message: "Task Edited successfully",
      task,
    });
  } catch (error) {
    console.error("updateTask error : ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all the tasks of specific user : /api/task/get
export const getTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Fetched all tasks",
      tasks,
    });
  } catch (error) {
    console.log("getTasks err : ", error.message);
    return res.json({ success: false, message: error.message });
  }
};

//Delete task : /api/task/delete/:id
export const deleteTask = async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    //Find the task belonging to this user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.json({
        success: false,
        message: "Task not found",
      });
    }

    //Delete task
    await Task.deleteOne({ _id: taskId });

    return res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("deleteTask err : ", error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Toggle completed status : /api/task/toggle/:id
export const toggleStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.json({
        success: false,
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

    await task.save();

    return res.json({
      success: true,
      message: `Task marked as ${task.completed ? "completed" : "pending"}`,
      task,
    })
  } catch (error) {
    console.log("toggleStatus err : ",error.message);
    return res.json({
      success: false,
      message: error.message
    })
  }
};
