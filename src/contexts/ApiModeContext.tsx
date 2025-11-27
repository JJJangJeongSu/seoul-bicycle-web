import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ApiModeContextType {
  useMockMode: boolean;
  toggleMockMode: () => void;
  setMockMode: (enabled: boolean) => void;
}

const ApiModeContext = createContext<ApiModeContextType | undefined>(undefined);

const STORAGE_KEY = 'seoul-bicycle-mock-mode';

interface ApiModeProviderProps {
  children: ReactNode;
}

export function ApiModeProvider({ children }: ApiModeProviderProps) {
  // Initialize from localStorage, default to true (mock mode) for development
  const [useMockMode, setUseMockMode] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    // Default to mock mode in development
    return import.meta.env.DEV;
  });

  // Persist to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(useMockMode));
  }, [useMockMode]);

  const toggleMockMode = () => {
    setUseMockMode(prev => !prev);
  };

  const setMockMode = (enabled: boolean) => {
    setUseMockMode(enabled);
  };

  return (
    <ApiModeContext.Provider
      value={{
        useMockMode,
        toggleMockMode,
        setMockMode,
      }}
    >
      {children}
    </ApiModeContext.Provider>
  );
}

export function useApiMode() {
  const context = useContext(ApiModeContext);
  if (context === undefined) {
    throw new Error('useApiMode must be used within ApiModeProvider');
  }
  return context;
}
