import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient, type LoginResponse } from './api';

type AuthContextValue = {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (input: { username_email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('access_token'));

  useEffect(() => {
    if (accessToken) localStorage.setItem('access_token', accessToken);
    else localStorage.removeItem('access_token');
  }, [accessToken]);

  const login = useCallback(async (input: { username_email: string; password: string }) => {
    const res: LoginResponse = await apiClient.login(input);
    setAccessToken(res.data.access_token);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ isAuthenticated: Boolean(accessToken), accessToken, login, logout }), [accessToken, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return children;
}


