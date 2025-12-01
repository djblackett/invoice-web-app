import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { useNewAuth } from "../contexts/NewAuthContext";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
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

/**
 * New Login Page
 * Supports email/password and OAuth authentication
 */
const NewLogin: React.FC = () => {
  const { isAuthenticated, isLoading } = useNewAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading...</p>
        </LoadingContainer>
      </Container>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/invoices" replace />;
  }

  return (
    <Container>
      {showRegister ? (
        <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </Container>
  );
};

export default NewLogin;
