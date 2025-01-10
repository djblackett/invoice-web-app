import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

function WelcomePage() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (isAuthenticated) {
    return <Navigate to="/invoices" replace />;
  }

  return <Navigate to="login" replace />;
}

export default WelcomePage;
