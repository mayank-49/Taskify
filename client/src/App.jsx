import React from "react";
import { AppContextProvider } from "./context/AppContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./pages/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-white text-black outfit">
      <Toaster />
      <AppContextProvider>
        <BrowserRouter>
          <Routes>

            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Route */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

              <Route path="*" element={<ErrorPage/>}/>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </div>
  );
};

export default App;
