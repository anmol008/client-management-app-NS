
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
interface AuthLayoutProps {
  protected?: boolean;
  withHeader?: boolean;
}

export const AuthLayout = ({ protected: isProtected = false, withHeader = false }: AuthLayoutProps) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isProtected && !isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (!isProtected && isAuthenticated) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
