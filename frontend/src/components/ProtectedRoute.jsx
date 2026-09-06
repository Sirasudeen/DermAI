import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Aperture from "./Aperture";

/* Signed-out visitors are sent to sign in and returned to where they were
   headed, instead of landing on a 404 as they did before. */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) return <Aperture label="Checking your session" />;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}
