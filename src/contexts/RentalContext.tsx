import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Rental } from '../types';

interface RentalContextType {
  currentRental: Rental | null;
  setCurrentRental: (rental: Rental | null) => void;
  startRental: (rental: Rental) => void;
  endRental: () => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

interface RentalProviderProps {
  children: ReactNode;
}

export function RentalProvider({ children }: RentalProviderProps) {
  const [currentRental, setCurrentRental] = useState<Rental | null>(null);

  const startRental = useCallback((rental: Rental) => {
    setCurrentRental(rental);
  }, []);

  const endRental = useCallback(() => {
    setCurrentRental(null);
  }, []);

  // Listen for logout event to clear rental
  useEffect(() => {
    const handleLogout = () => {
      setCurrentRental(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return (
    <RentalContext.Provider
      value={{
        currentRental,
        setCurrentRental,
        startRental,
        endRental,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error('useRental must be used within RentalProvider');
  }
  return context;
}
