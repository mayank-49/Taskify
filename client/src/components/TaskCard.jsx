import { Trash2, Pencil, Check } from "lucide-react";

const TaskCard = ({ task, onToggle, onEdit, onDelete, formatDate }) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white border border-gray-200
        p-5 transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        flex flex-col
        min-h-[140px]
        ${task.completed ? "opacity-70" : ""}
      `}
    >
      {/* Priority Gradient Bar */}
      <div
        className={`absolute top-0 left-0 h-1 w-full
          ${
            task.priority === "high"
              ? "bg-gradient-to-r from-rose-500 to-pink-500"
              : task.priority === "medium"
              ? "bg-gradient-to-r from-amber-400 to-orange-400"
              : "bg-gradient-to-r from-emerald-500 to-green-500"
          }
        `}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {task.priority} priority
          </span>

          <h3
            className={`mt-1 text-lg font-semibold ${
              task.completed
                ? "line-through text-gray-400"
                : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Tick */}
        <button
          onClick={() => onToggle(task._id)}
          className={`
            w-6 h-6 rounded-full cursor-pointer flex items-center justify-center
            border transition
            ${
              task.completed
                ? "bg-green-600 text-white"
                : "border-gray-300 hover:border-green-600"
            }
          `}
        >
          <Check size={15} />
        </button>
      </div>

      {/* Description (optional) */}
      {task.description && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer — always sticks to bottom */}
      <div className="mt-auto pt-6 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {task.dueDate ? formatDate(task.dueDate) : "No due date"}
        </span>

        <div className="flex gap-3">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 cursor-pointer hover:text-green-500 transition"
            >
              <Pencil size={16} />
            </button>
          )}

          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-rose-500 cursor-pointer transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
