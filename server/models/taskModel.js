import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    category: {
      type: String,
      trim: true,
      default: "general", // fallback category
    },
  },
  { timestamps: true }
);

const Task = mongoose.models.task || mongoose.model("task", taskSchema);

export default Task;
