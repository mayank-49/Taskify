import React from "react";
import { useAppContext } from "../context/AppContext";
import TaskStatusPie from "../components/TaskStatusPie";
import TaskCategoryBar from "../components/TaskCategoryBar";

const AnalyticsPage = () => {
  const { tasks } = useAppContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
          Analytics
        </h1>
        <p className="text-gray-500 mt-1">Overview of your task progress</p>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <h2 className="text-3xl font-semibold text-gray-900">
            {tasks.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-3xl font-semibold text-emerald-600">
            {completed}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-3xl font-semibold text-rose-600">
            {pending}
          </h2>
        </div>
      </div> */}

      {/* Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskStatusPie tasks={tasks} />
        <TaskCategoryBar tasks={tasks} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
