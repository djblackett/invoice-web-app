import { SyntheticEvent, useState } from "react";
import {
  Container,
  Form,
  Input,
  Label,
  Button,
  ErrorMessage,
  SuccessMessage,
} from "./LoginForm.styles";
import { useMutation } from "@apollo/client";
import { LOGIN } from "src/graphql/user-queries";
import { DarkenScreen } from "src/styles/editStyles";
import { ClickOutsideProvider } from "@shelf/react-outside-click";

type LoginFormProps = {
  isLoginOpen: boolean;
  setIsLoginOpen: (isLoginOpen: boolean) => void;
  toggleLogin: (isLoginOpen: boolean) => void;
};

const LoginForm = ({
  isLoginOpen,
  setIsLoginOpen,
  toggleLogin,
}: LoginFormProps) => {
  // State variables for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // useMutation hook for the LOGIN mutation
  const [login, { data, loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      // Handle successful login, e.g., store token, redirect, etc.
      console.log("Login successful:", data);
      // You might want to redirect the user or update the app state here
    },
    onError: (error) => {
      // Errors are handled in the component via the 'error' object
      console.error("Login error:", error);
    },
  });

  // Handler for form submission
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    const result = await login({
      variables: {
        username: username.trim(),
        password: password.trim(),
      },
    });
    if (result.data) {
      setIsLoginOpen(false);
      // todo - do other login stuff
    }
  };

  if (isLoginOpen) {
    return (
      <DarkenScreen>
        <ClickOutsideProvider onOutsideClick={toggleLogin}>
          <Container>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
              {/* Username Field */}
              <Label htmlFor="username">Username:</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />

              {/* Password Field */}
              <Label htmlFor="password">Password:</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />

              {/* Submit Button */}
              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Error Message */}
              {error && <ErrorMessage>{error.message}</ErrorMessage>}

              {/* Success Message */}
              {data && data.login && (
                <SuccessMessage>Welcome, {data.login.username}!</SuccessMessage>
              )}
            </Form>
          </Container>
        </ClickOutsideProvider>
      </DarkenScreen>
    );
  }
};

export default LoginForm;
