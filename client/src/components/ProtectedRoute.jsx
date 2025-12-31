import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import FullPageLoader from "./FullPageLoader.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loadingUser } = useAppContext();

  if (loadingUser) return <FullPageLoader/>;  // ← no loading UI

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
