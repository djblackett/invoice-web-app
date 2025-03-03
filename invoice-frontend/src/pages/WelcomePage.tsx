import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

function WelcomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (isAuthenticated) {
    return <Navigate to="/invoices" replace />;
  }

  return <Navigate to="login" replace />;
}

export default WelcomePage;
