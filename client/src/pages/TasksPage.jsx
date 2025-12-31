import React, { useState, useRef, useEffect } from "react";
import { Search, CheckCircle2, Trash2, ChevronDown } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import TaskCard from "../components/TaskCard";

const TasksPage = () => {
  const { tasks, deleteTask, toggleTask, formatDate, updateTask } =
    useAppContext();

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [openPopup, setOpenPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priorityEdit, setPriorityEdit] = useState("");
  const [categoryEdit, setCategoryEdit] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
const [openCategory, setOpenCategory] = useState(false);


  const priorityRef = useRef(null);
  const statusRef = useRef(null);
  const categoryRef = useRef(null);


  /* ---------------- CLOSE DROPDOWNS ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setOpenPriority(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setOpenStatus(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
  setOpenCategory(false);
}
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  /* ---------------- TASK ACTIONS ---------------- */
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setPriorityEdit(task.priority || "");
    setCategoryEdit(task.category || "");
    setOpenPopup(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriorityEdit("");
    setCategoryEdit("");
    setCategoryOpen(false);
    setEditingTask(null);
    setPriorityOpen(false);
  };

  const handleUpdateTask = async () => {
    setLoading(true);
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const success = await updateTask(editingTask._id, {
      title,
      description,
      dueDate,
      priority: priorityEdit,
      category: categoryEdit,
    });

    if (success) {
      setOpenPopup(false);
      setEditingTask(null);
      setLoading(false);
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    const matchPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    const matchStatus =
      status === "all" ||
      (status === "completed" && task.completed) ||
      (status === "pending" && !task.completed);

    const matchCategory =
  categoryFilter === "all" || task.category === categoryFilter;

return matchSearch && matchPriority && matchStatus && matchCategory;

  });

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
          All Tasks
        </h1>
        <p className="text-gray-500 mt-1">Search and filter all your tasks</p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div
        className="relative z-50
    grid grid-cols-1 md:grid-cols-4 gap-4
    bg-white/80 backdrop-blur-md p-4 rounded-2xl
    border border-gray-100 shadow-sm"
      >
        {/* SEARCH */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl
            border border-gray-300 focus:ring-2 focus:ring-indigo-500
            outline-none transition text-sm"
          />
        </div>

        {/* PRIORITY DROPDOWN */}
        <div ref={priorityRef} className="relative">
          <button
            onClick={() => setOpenPriority(!openPriority)}
            className="w-full flex items-center justify-between cursor-pointer px-4 py-2.5
            rounded-xl border border-gray-300 bg-white
            hover:border-indigo-400 transition text-sm"
          >
            <span
              className={
                priorityFilter === "high"
                  ? "text-rose-600 font-medium"
                  : priorityFilter === "medium"
                  ? "text-orange-500 font-medium"
                  : priorityFilter === "low"
                  ? "text-emerald-600 font-medium"
                  : "text-gray-400"
              }
            >
              {priorityFilter === "all" ? "All Priorities" : priorityFilter}
            </span>

            <ChevronDown
              size={18}
              className={`transition ${openPriority ? "rotate-180" : ""}`}
            />
          </button>

          {openPriority && (
            <div
              className="absolute z-[100] mt-2 w-full bg-white rounded-xl
              shadow-2xl border border-gray-100  overflow-hidden"
            >
              {["all", "high", "medium", "low"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPriorityFilter(p);
                    setOpenPriority(false);
                  }}
                  className={`w-full px-4 cursor-pointer py-2.5 text-left text-sm transition
      hover:bg-indigo-50
      ${
        p === "high"
          ? "text-rose-600"
          : p === "medium"
          ? "text-orange-500"
          : p === "low"
          ? "text-emerald-600"
          : "text-gray-700"
      }
      ${priorityFilter === p ? "font-semibold bg-indigo-50" : ""}
    `}
                >
                  {p === "all" ? "All Priorities" : p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* STATUS DROPDOWN */}
        <div ref={statusRef} className="relative">
          <button
            onClick={() => setOpenStatus(!openStatus)}
            className="w-full flex items-center justify-between cursor-pointer px-4 py-2.5
            rounded-xl border border-gray-300 bg-white
            hover:border-indigo-400 transition text-sm"
          >
            <span
              className={
                status === "completed"
                  ? "text-emerald-600 font-medium"
                  : status === "pending"
                  ? "text-rose-600 font-medium"
                  : "text-gray-400"
              }
            >
              {status === "all" ? "All Status" : status}
            </span>

            <ChevronDown
              size={18}
              className={`transition ${openStatus ? "rotate-180" : ""}`}
            />
          </button>

          {openStatus && (
            <div
              className="absolute z-[100] mt-2 w-full bg-white rounded-xl
              shadow-xl border border-gray-100 overflow-hidden"
            >
              {["all", "completed", "pending"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setOpenStatus(false);
                  }}
                  className={`w-full px-4 py-2.5 cursor-pointer text-left text-sm transition
      hover:bg-indigo-50
      ${
        s === "completed"
          ? "text-emerald-600"
          : s === "pending"
          ? "text-rose-600"
          : "text-gray-700"
      }
      ${status === s ? "font-semibold bg-indigo-50" : ""}
    `}
                >
                  {s === "all" ? "All Status" : s}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* CATEGORY DROPDOWN */}
<div ref={categoryRef} className="relative">
  <button
    onClick={() => setOpenCategory(!openCategory)}
    className="w-full flex items-center justify-between cursor-pointer px-4 py-2.5
    rounded-xl border border-gray-300 bg-white
    hover:border-indigo-400 transition text-sm"
  >
    <span
      className={
        categoryFilter === "all"
          ? "text-gray-400"
          : "text-indigo-600 font-medium"
      }
    >
      {categoryFilter === "all" ? "All Categories" : categoryFilter}
    </span>

    <ChevronDown
      size={18}
      className={`transition ${openCategory ? "rotate-180" : ""}`}
    />
  </button>

  {openCategory && (
    <div
      className="absolute z-[100] mt-2 w-full bg-white rounded-xl
      shadow-xl border border-gray-100 overflow-hidden"
    >
      {["all","general", "work", "personal", "study", "health", "other"].map((c) => (
        <button
          key={c}
          onClick={() => {
            setCategoryFilter(c);
            setOpenCategory(false);
          }}
          className={`w-full px-4 py-2.5 cursor-pointer text-left text-sm transition
          hover:bg-indigo-50 capitalize
          ${categoryFilter === c ? "font-semibold bg-indigo-50" : "text-gray-700"}
        `}
        >
          {c === "all" ? "All Categories" : c}
        </button>
      ))}
    </div>
  )}
</div>

      </div>

      {/* ================= TASK LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={toggleTask}
            onDelete={(id) => {
              setTaskToDelete(id);
              setShowDeleteModal(true);
            }}
            onEdit={handleEdit}
            formatDate={formatDate}
          />
        ))}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 animate-scaleIn">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Task
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete this task? This action cannot
                  be undone.
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
                  className="px-4 py-2 rounded-xl text-sm cursor-pointer font-semibold
          bg-rose-500 text-white hover:bg-rose-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

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
                <div className="grid grid-cols-3 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      DUE DATE
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1 w-full px-2 py-2.5 rounded-lg cursor-pointer
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
                      className="mt-1 w-full px-3 py-2.5 cursor-pointer rounded-lg
      border border-gray-300 bg-white text-left text-sm
      flex items-center justify-between
      hover:border-indigo-500
      focus:ring-2 focus:ring-indigo-500
      transition"
                    >
                      <span
                        className={`capitalize ${
                          priorityEdit === "high"
                            ? "text-rose-600"
                            : priorityEdit === "medium"
                            ? "text-amber-600"
                            : priorityEdit === "low"
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                      >
                        {priorityEdit || "Select priority"}
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
                              setPriorityEdit(level);
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
                      className="mt-1 w-full px-4 py-2.5 rounded-lg cursor-pointer
    border border-gray-300 bg-white text-left text-sm
    flex items-center justify-between
    hover:border-indigo-500
    focus:ring-2 focus:ring-indigo-500
    transition"
                    >
                      <span
                        className={`capitalize ${
                          categoryEdit ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {categoryEdit || "Select category"}
                      </span>

                      <span className="text-gray-400">▾</span>
                    </button>

                    {/* Dropdown */}
                    {categoryOpen && (
                      <div
                        className="absolute z-20 mt-2 w-full bg-white
      border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                      >
                        {["work", "personal", "study", "health", "other"].map(
                          (item) => (
                            <button
                              key={item}
                              onClick={() => {
                                setCategoryEdit(item);
                                setCategoryOpen(false);
                              }}
                              className="w-full px-4 py-2.5 text-sm text-left
          hover:bg-gray-50 transition capitalize"
                            >
                              {item}
                            </button>
                          )
                        )}
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
                  onClick={handleUpdateTask}
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

        {filteredTasks.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No tasks found
          </p>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
