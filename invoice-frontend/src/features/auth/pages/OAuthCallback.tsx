import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { useNewAuth } from "../contexts/NewAuthContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c5dfa;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  margin-top: 24px;
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  margin-top: 24px;
  max-width: 400px;
  text-align: center;
`;

/**
 * OAuth Callback Handler
 * This page is shown after OAuth redirect from provider
 * The NewAuthContext automatically extracts and stores the token
 */
export const OAuthCallback: React.FC = () => {
  const { isAuthenticated, isLoading } = useNewAuth();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL params
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      setError(
        errorParam === "oauth_failed"
          ? "OAuth authentication failed. Please try again."
          : errorParam
      );
    }
  }, []);

  // Show error if present
  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <Message>
          <a href="/login">Return to login</a>
        </Message>
      </Container>
    );
  }

  // Redirect to invoices if authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/invoices" replace />;
  }

  // Show loading while processing
  return (
    <Container>
      <LoadingSpinner />
      <Message>Completing sign in...</Message>
    </Container>
  );
};
