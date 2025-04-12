import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { Navigate } from "react-router";
import { SlidingButton } from "@/features/shared/animations/AnimatedButton.tsx";
import {
  DemoButtonStyled,
  LoginLogoutButton,
} from "@/features/shared/components/Header.tsx";
import TextAnimation from "@/features/shared/animations/AnimatedText.tsx";
import { ViewContainer } from "@/features/invoices/styles/ViewInvoiceStyles.tsx";
import { useDemoModeContext } from "@/features/shared/components/DemoModeProvider";
import { startTransition } from "react";
import React from "react";

const Login = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();
  const { isDemoMode, setIsDemoMode } = useDemoModeContext();

  const text = "Please login to view your invoices";
  const activeDemoText =
    "Demo mode activated. Please login to view your invoices";

  // // When demo mode becomes true, navigate to "/"
  // useEffect(() => {
  //   if (isDemoMode && !hasNavigated) {
  //     setHasNavigated(true);
  //     navigate("/");
  //   }
  // }, [isDemoMode, navigate, hasNavigated]);

  const loginToDemoAccount = () => {
    console.log("Demo login triggered");
    // Directly update state and let the effect handle navigation.
    startTransition(() => setIsDemoMode((prev) => !prev));
    // You can remove flushSync and setTimeout, and let React do its job.
  };

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
          <TextAnimation
            text={isDemoMode ? activeDemoText : text}
            testId="welcome-text"
          />
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
          <SlidingButton
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 0.5,
              delay: 1.1,
            }}
          >
            <DemoButtonStyled
              whileTap={{ scale: 0.85 }}
              onClick={loginToDemoAccount}
              data-testid="demo-login-button"
              aria-label="demo-login button"
            >
              Demo mode: {isDemoMode ? "ON" : "OFF"}
            </DemoButtonStyled>
          </SlidingButton>
        </ViewContainer>
      )}
    </>
  );
};

const MemoizedLogin = React.memo(Login);
MemoizedLogin.displayName = "Login";
export default MemoizedLogin;
