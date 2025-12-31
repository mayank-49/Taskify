import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import axios from "axios";

//This will ensure that cookies are sent along with requests
axios.defaults.withCredentials = true;

//Backend URL is set to be the base url for any api call made through axios
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [tasks, setTasks] = useState([]);

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

  const fetchUser = async () => {
    try {
      const { data } = await api.post("/api/user/is-auth", {});
      if (data.success) {
        setUser(data.user);
        setIsUser(true);
      } else {
        setUser(null);
        setIsUser(false);
      }
    } catch (error) {
      setUser(null);
      setIsUser(false);
    } finally {
      setLoadingUser(false);
    }
  };

  const formatDate = (date) => {
  if (!date) return "No due date";

  const d = new Date(date);
  if (isNaN(d)) return "No due date";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};


  /* ================= TASK FUNCTIONS ================= */

  const fetchUserTasks = async () => {
    try {
      const { data } = await api.get("/api/task/get");
      if (data.success) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addTask = async (payload) => {
    try {
      const { data } = await api.post("/api/task/add", payload);
      if (data.success) {
        toast.success(data.message || "Task added");
        fetchUserTasks();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Add task failed");
    }
    return false;
  };

  const updateTask = async (id, payload) => {
    try {
      const { data } = await api.patch(`/api/task/${id}`, payload);
      if (data.success) {
        toast.success(data.message || "Task updated");
        fetchUserTasks();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
    return false;
  };

  const deleteTask = async (id) => {
    try {
      const { data } = await api.delete(`/api/task/${id}/delete`);
      if (data.success) {
        toast.success(data.message || "Task deleted");
        fetchUserTasks();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleTask = async (id) => {
    try {
      const { data } = await api.patch(`/api/task/${id}/toggle`);
      if (data.success) {
        toast.success(data.message)
        fetchUserTasks();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================================================== */

  useEffect(() => {
    fetchUserTasks();
  }, [user]);

  useEffect(() => {
    setLoadingUser(true);
    setTimeout(() => {
      fetchUser();
    }, 2000);
  }, []);

  const value = {
    user,
    setUser,
    isUser,
    axios,
    loadingUser,
    api,
    tasks,
    fetchUserTasks,
    formatDate,

    // ✅ newly added
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
