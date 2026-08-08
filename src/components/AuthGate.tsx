import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Login } from './Login';

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Login />;
  return <>{children}</>;
}
