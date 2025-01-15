import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { SlidingComponent } from "src/components/buttons/AnimatedButton";
import { LoginLogoutButton } from "src/components/menus-toolbars/Header";
import TextAnimation from "src/components/text/AnimatedText";

const Login = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const text = "Please login to view your invoices";

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (isAuthenticated) {
    return <Navigate to="/invoices" replace />;
  }
  return (
    <>
      {!isAuthenticated && (
        <>
          <TextAnimation text={text} testId="welcome-text" />
          <SlidingComponent
            initial={{ x: "-100%", opacity: 0 }} // Start off-screen to the left
            animate={{ x: 0, opacity: 1 }} // Animate to original position
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 0.5,
              delay: 1,
            }}
          >
            <LoginLogoutButton
              whileTap={{ scale: 0.85 }}
              onClick={() => loginWithRedirect()}
              data-testid="login-button"
            >
              Login
            </LoginLogoutButton>
          </SlidingComponent>
        </>
      )}
    </>
  );
};

export default Login;
