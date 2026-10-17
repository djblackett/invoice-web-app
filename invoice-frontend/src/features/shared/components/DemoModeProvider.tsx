import React, {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";

interface DemoModeContextType {
  isDemoMode: boolean;
  setIsDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
  demoEntryId: number;
  initializeDemo: (reset: () => Promise<unknown>) => Promise<void>;
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
  const [state, setState] = useState({
    active: import.meta.env.VITE_DEMO_MODE === "true",
    entryId: 0,
  });
  const initialization = useRef<{ id: number; promise: Promise<void> } | null>(
    null,
  );
  const setIsDemoMode = useCallback<
    React.Dispatch<React.SetStateAction<boolean>>
  >((value) => {
    setState((previous) => {
      const active =
        typeof value === "function" ? value(previous.active) : value;
      return {
        active,
        entryId: previous.entryId + (!previous.active && active ? 1 : 0),
      };
    });
  }, []);
  // Keep the entry promise above App/provider swaps. StrictMode effect replay,
  // route changes and incidental App remounts reuse it rather than resetting.
  const initializeDemo = useCallback(
    (reset: () => Promise<unknown>) => {
      if (initialization.current?.id !== state.entryId) {
        const entryId = state.entryId;
        initialization.current = {
          id: state.entryId,
          promise: Promise.resolve()
            .then(reset)
            .then(() => undefined)
            .catch((error) => {
              if (initialization.current?.id === entryId)
                initialization.current = null;
              throw error;
            }),
        };
      }
      return initialization.current.promise;
    },
    [state.entryId],
  );

  const value = useMemo(() => {
    return {
      isDemoMode: state.active,
      demoEntryId: state.entryId,
      setIsDemoMode,
      initializeDemo,
    };
  }, [state, setIsDemoMode, initializeDemo]);
  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export { DemoModeProvider, useDemoModeContext };
