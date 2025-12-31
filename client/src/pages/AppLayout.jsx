import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, api, setUser } = useAppContext();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const { data } = await api.post("/api/user/logout");
      if (data.success) {
        setUser(null);
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const links = [
    { name: "Dashboard", path: "/", icon: dashboardIcon },
    { name: "Tasks", path: "/tasks", icon: tasksIcon },
    { name: "Analytics", path: "/analytics", icon: analyticsIcon },
  ];

  return (
    <div className="flex min-h-screen bg-indigo-50">


      {/* ============================ */}
      {/*      DESKTOP SIDEBAR        */}
      {/* ============================ */}
      <aside
        className="
          fixed top-4 left-4
          h-[95vh] w-68
          bg-white backdrop-blur-xl
          shadow-2xl shadow-indigo-200/40
          rounded-2xl border-2 border-white/40
          p-6 flex-col gap-4 hidden lg:flex
          transition-all duration-300
        "
      >
        {/* Brand */}
        <div className="flex items-center gap-2 mb-4 border-b-2 pb-2 border-indigo-500">
          <div className="w-10 h-10 bg-indigo-500 text-white rounded-2xl 
            flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/40">
            T
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-wide">
            Taskify
          </h1>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-4">
          {links.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl font-medium
                  transition-all duration-300
                  ${active
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-400/40 scale-[1.03]"
                    : "text-slate-700 hover:bg-white/60 hover:shadow-sm"
                  }
                `}
              >
                <span
                  className={`w-6 h-6 ${
                    active ? "text-white" : "text-indigo-600"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ============================ */}
      {/*        MOBILE SIDEBAR        */}
      {/* ============================ */}
      <aside
        className={`
          fixed top-0 left-0 
          h-full w-64 z-[999]
          bg-white/90 backdrop-blur-xl border-r border-white/50
          p-6 flex flex-col gap-6 shadow-2xl shadow-indigo-300/40
          lg:hidden
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-all duration-300
        `}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-indigo-600 text-2xl self-end"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">Taskify</h1>

        {/* Links */}
        <nav className="flex flex-col gap-3">
          {links.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl font-medium
                  transition-all duration-300
                  ${active
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-slate-700 hover:bg-gray-100"
                  }
                `}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ============================ */}
      {/*         MAIN CONTENT         */}
      {/* ============================ */}
      <main className="flex-1 lg:ml-80 p-4 lg:pr-10 w-full ">

        {/* MOBILE TOP BAR */}
        <header className="lg:hidden flex items-center justify-between bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg mb-4">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            ☰
          </button>

          <p className="text-lg font-medium">
            Hi, {user?.name?.split(" ")[0]}
          </p>

          <button
            onClick={handleLogout}
            className="bg-white/20 px-3 py-1 cursor-pointer rounded-lg text-sm"
          >
            Logout
          </button>
        </header>

        {/* DESKTOP TOP BAR */}
        <header
          className="
            hidden lg:flex items-center justify-between 
            bg-white backdrop-blur-md shadow-xl 
            rounded-xl px-8 py-4 mb-6 border border-white/40
          "
        >
          <p className="text-lg font-medium text-slate-700">
            Welcome,{" "}
            <span className="font-semibold text-indigo-600">
              {user?.name?.split(" ")[0]}
            </span>
          </p>

          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 bg-indigo-500 text-white rounded-full 
              flex items-center justify-center font-semibold shadow-lg shadow-indigo-400/40"
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl cursor-pointer bg-white hover:bg-indigo-100 text-indigo-600 font-medium shadow-md transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div
          className="w-full min-h-[81vh] h-auto"
        >
          <Outlet />
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      {/* <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t lg:hidden flex justify-around py-2">
        {links.map((item, i) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={i}
              to={item.path}
              className={`flex flex-col items-center text-xs ${
                active ? "text-indigo-600" : "text-gray-600"
              }`}
            >
              <div className="w-6 h-6">{item.icon}</div>
              {item.name}
            </Link>
          );
        })}
      </div> */}

    </div>
  );
};

export default AppLayout;

/* ----- ICONS ----- */

const dashboardIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 5h5v4H4V5zm11 0h5v7h-5V5zM4 12h5v8H4v-8zm11 5h5v3h-5v-3z" />
  </svg>
);

const tasksIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14v11H5V5z" />
  </svg>
);

const analyticsIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 19h4V5H4v14zm6 0h4V8h-4v11zm6 0h4v-6h-4v6z" />
  </svg>
);
