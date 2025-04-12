import React, { createContext, ReactNode, useMemo, useState } from "react";

interface DemoModeContextType {
  isDemoMode: boolean;
  setIsDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the Context with an initial undefined value.
const DemoModeContext = createContext<DemoModeContextType | undefined>(
  undefined,
);

function useDemoModeContext() {
  const context = React.useContext(DemoModeContext);

  if (context === undefined) {
    throw new Error("useDemoModeContext must be used within an AppProvider");
  }
  return context;
}

interface DemoModeProviderProps {
  children: ReactNode;
}

// Create the Provider component.
const DemoModeProvider = ({ children }: DemoModeProviderProps) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const value = useMemo(() => {
    return { isDemoMode, setIsDemoMode };
  }, [isDemoMode]);
  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export { DemoModeProvider, useDemoModeContext };
