import { UnifiedAuthProvider } from "@/features/auth/components/UnifiedAuthProvider";
import { HashRouter } from "react-router-dom";
import App from "./App";

const AppWrapper = () => {
  return (
    <UnifiedAuthProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </UnifiedAuthProvider>
  );
};

export default AppWrapper;
