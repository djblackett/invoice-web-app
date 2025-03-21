import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { Navigate } from "react-router-dom";
import { SlidingButton } from "@/features/shared/animations/AnimatedButton.tsx";
import { LoginLogoutButton } from "@/features/shared/components/Header.tsx";
import TextAnimation from "@/features/shared/animations/AnimatedText.tsx";
import { ViewContainer } from "@/features/invoices/styles/ViewInvoiceStyles.tsx";

const Login = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();
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
        <ViewContainer
          role="main"
          aria-labelledby="welcome-text"
          style={{ marginTop: 0 }}
        >
          <TextAnimation text={text} testId="welcome-text" />
          <SlidingButton
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
              aria-label="login button"
            >
              Login
            </LoginLogoutButton>
          </SlidingButton>
        </ViewContainer>
      )}
    </>
  );
};

export default Login;
