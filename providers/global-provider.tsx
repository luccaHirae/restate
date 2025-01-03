import { useAppwrite } from '@/hooks/useAppwrite';
import { getCurrentUser } from '@/lib/appwrite';
import { createContext, useContext } from 'react';

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (params?: Record<string, string | number>) => Promise<void>;
}

interface GlobalProviderProps {
  children: React.ReactNode;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const { data, loading, refetch } = useAppwrite({
    fn: getCurrentUser,
  });

  const value = {
    isLoggedIn: !!data,
    user: data as User,
    loading,
    refetch: refetch as (
      params?: Record<string, string | number>
    ) => Promise<void>,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }

  return context;
};
