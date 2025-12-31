import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  CheckCircle2,
  Search,
  Pencil,
  Check,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
  const [filter, setFilter] = useState("all");
  const [openPopup, setOpenPopup] = useState(false);
  const { tasks, addTask, updateTask, deleteTask, toggleTask, formatDate } =
    useAppContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const navigate = useNavigate();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const hasMore = tasks.length > 3;

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setPriority(task.priority || "");
    setCategory(task.category || "");
    setOpenPopup(true);
  };

  const handleSubmitTask = async () => {
    if (!title.trim()) return toast.error("Title required");
    setLoading(true);

    const payload = { title, description, dueDate, priority, category };

    const success = editingTask
      ? await updateTask(editingTask._id, payload)
      : await addTask(payload);

    if (success) {
      resetForm();
      setOpenPopup(false);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setCategory("");
    setCategoryOpen(false);
    setEditingTask(null);
    setPriorityOpen(false);
  };

  useEffect(() => {
    if (openPopup || showDeleteModal) {
      // Stop background scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openPopup, showDeleteModal]);

  // const filteredTasks =
  //   filter === "all"
  //     ? tasks
  //     : filter === "completed"
  //     ? tasks.filter((t) => t.completed)
  //     : tasks.filter((t) => !t.completed);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Track your productivity 📈</p>
        </div>

        <button
          onClick={() => setOpenPopup(true)}
          className="flex items-center cursor-pointer gap-2 px-6 py-3 rounded-xl 
          bg-indigo-500 text-white font-medium 
          shadow-lg shadow-indigo-500/30
          hover:bg-indigo-700 hover:shadow-indigo-500/40
          transition-all"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {openPopup && (
        <div className="fixed inset-0 z-50 h-full w-full flex items-center justify-center bg-black/30 px-4">
          <div
            className="w-full max-w-md bg-white rounded-2xl 
      shadow-xl border border-gray-200 animate-scaleIn"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 
        border-b border-gray-100"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingTask ? "Edit Task" : "New Task"}
                </h2>

                <p className="text-sm text-gray-500">
                  Add details to stay organized
                </p>
              </div>

              <button
                onClick={() => {
                  setOpenPopup(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center
            text-gray-400 hover:text-indigo-500 cursor-pointer hover:bg-indigo-50 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  TITLE
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Finish dashboard UI"
                  className="mt-1 w-full px-4 py-2.5 rounded-lg
              border border-gray-300
               focus:ring-2 focus:ring-indigo-500
              outline-none transition text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  DESCRIPTION
                </label>

                <textarea
                  rows="3"
                  placeholder="Short task description (max 50 characters)"
                  value={description}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value.length <= 50) {
                      setDescription(value);
                    }
                  }}
                  className="mt-1 w-full px-4 py-2.5 rounded-lg
      border border-gray-300 resize-none
      focus:ring-2 focus:ring-indigo-500
      outline-none transition text-sm"
                />

                {/* Character counter */}
                <div className="mt-1 text-right text-xs text-gray-400">
                  {description.length} / 50 characters
                </div>
              </div>

              {/* Date + Priority */}
              <div className="grid grid-cols-3 gap-2">
                {/* Due Date */}
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    DUE DATE
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 w-full px-2 py-2.5 cursor-pointer rounded-lg
                border border-gray-300 focus:ring-2 focus:ring-indigo-500
                outline-none transition text-sm"
                  />
                </div>

                {/* Priority */}
                <div className="relative">
                  <label className="text-xs font-medium text-gray-500">
                    PRIORITY
                  </label>

                  {/* Selected */}
                  <button
                    type="button"
                    onClick={() => setPriorityOpen(!priorityOpen)}
                    className="mt-1 w-full px-3 py-2.5 cursor-pointer rounded-lg border border-gray-300 bg-white text-left text-sm flex items-center justify-between hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    <span
                      className={`capitalize ${
                        priority === "high"
                          ? "text-rose-600"
                          : priority === "medium"
                          ? "text-amber-600"
                          : priority === "low"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    >
                      {priority || "Priority"}
                    </span>

                    <span className="text-gray-400">▾</span>
                  </button>

                  {/* Dropdown */}
                  {priorityOpen && (
                    <div
                      className="absolute z-20 mt-2 w-full bg-white
      border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                    >
                      {["high", "medium", "low"].map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setPriority(level);
                            setPriorityOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-sm text-left
            hover:bg-gray-50 flex items-center gap-2 transition"
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              level === "high"
                                ? "bg-rose-500"
                                : level === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span className="capitalize">{level}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category */}
<div className="relative">
  <label className="text-xs font-medium text-gray-500">
    CATEGORY
  </label>

  {/* Selected */}
  <button
    type="button"
    onClick={() => setCategoryOpen(!categoryOpen)}
    className="mt-1 w-full px-3 cursor-pointer py-2.5 rounded-lg
    border border-gray-300 bg-white text-left text-sm
    flex items-center justify-between
    hover:border-indigo-500
    focus:ring-2 focus:ring-indigo-500
    transition"
  >
    <span
      className={`capitalize ${
        category ? "text-gray-800" : "text-gray-400"
      }`}
    >
      {category || "Category"}
    </span>

    <span className="text-gray-400">▾</span>
  </button>

  {/* Dropdown */}
  {categoryOpen && (
    <div
      className="absolute z-20 mt-2 w-full bg-white
      border border-gray-200 rounded-xl shadow-lg overflow-hidden"
    >
      {["work", "personal", "study", "health", "other"].map((item) => (
        <button
          key={item}
          onClick={() => {
            setCategory(item);
            setCategoryOpen(false);
          }}
          className="w-full px-4 py-2.5 text-sm text-left
          hover:bg-gray-50 transition capitalize"
        >
          {item}
        </button>
      ))}
    </div>
  )}
</div>

              </div>
            </div>

            {/* Footer */}
            <div
              className="flex justify-end gap-3 px-6 py-4 
        border-t border-gray-100 bg-gray-50 rounded-b-2xl"
            >
              <button
                onClick={() => {
                  setOpenPopup(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-xl cursor-pointer text-sm font-medium
            text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitTask}
                disabled={loading}
                className={`px-5 py-2 rounded-lg cursor-pointer text-sm font-semibold
    bg-indigo-500 text-white
    hover:bg-indigo-700 transition shadow-sm
    ${loading && "opacity-70 cursor-not-allowed"}`}
              >
                {loading
                  ? editingTask
                    ? "Updating..."
                    : "Adding..."
                  : editingTask
                  ? "Update Task"
                  : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-5">
        <StatCard title="Total Tasks" value={total} color="indigo" />
        <StatCard title="Completed" value={completed} color="green" />
        <StatCard title="Pending" value={pending} color="red" />
      </div>

      {/* PROGRESS */}
      <div
        className="bg-white/80 backdrop-blur-md p-6 rounded-3xl 
        shadow-md border border-gray-100"
      >
        <p className="text-sm text-gray-500 mb-3">Overall Progress</p>
        <div className="w-full bg-gray-200/70 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">{progress}% completed</p>
      </div>

      {/* TASKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.slice(0, 3).map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={toggleTask}
            onEdit={handleEdit}
            onDelete={(id) => {
              setTaskToDelete(id);
              setShowDeleteModal(true);
            }}
            formatDate={formatDate}
          />
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 animate-scaleIn">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Task
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 rounded-xl cursor-pointer text-sm font-medium
          text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteTask(taskToDelete);
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 rounded-xl cursor-pointer text-sm font-semibold
          bg-rose-500 text-white hover:bg-rose-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center w-full mt-4">
          <button
            onClick={() => {
              navigate("/tasks");
            }}
            className="
        relative text-indigo-500 cursor-pointer font-semibold
        px-4 py-2
        after:absolute after:left-0 after:-bottom-1
        after:h-0.5 after:w-0 after:bg-indigo-500
        after:transition-all after:duration-300
        hover:after:w-full
      "
          >
            See more →
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

/* STAT CARD */

const StatCard = ({ title, value, color }) => {
  const colors = {
    indigo: "text-indigo-600",
    green: "text-emerald-600",
    red: "text-rose-600",
  };

  return (
    <div
      className="bg-white backdrop-blur-md rounded-xl text-center p-3 
      shadow-md border border-gray-100"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2
        className={`mt-4 text-3xl font-bold inline-block px-4 py-1 rounded-xl ${colors[color]}`}
      >
        {value}
      </h2>
    </div>
  );
};
