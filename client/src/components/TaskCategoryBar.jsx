import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TaskCategoryBar = ({ tasks }) => {
  // Count tasks per category
  const categoryMap = {};

  tasks.forEach((task) => {
    const category = task.category || "other";
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const data = Object.keys(categoryMap).map((key) => ({
    category: key,
    count: categoryMap[key],
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Tasks by Category
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No category data available</p>
      ) : (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                className="capitalize"
                />
                <YAxis
                allowDecimals={false}
                width={32}
                axisLine={false}
                tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TaskCategoryBar;
