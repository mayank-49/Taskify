import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // green, red

const TaskStatusPie = ({ tasks }) => {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Task Status Overview
      </h3>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-400 py-10">
          No tasks available
        </p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TaskStatusPie;
