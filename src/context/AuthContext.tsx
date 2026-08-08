import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createToken, decodeToken, isExpired, type TokenPayload } from '../services/mockJwt';

export const DEMO_CREDENTIALS = { username: 'padawan', password: 'usetheforce' };

const ACCESS_TTL_SECONDS = 45; // short on purpose, so silent refresh is easy to observe live
const REFRESH_TTL_SECONDS = 15 * 60;
const REFRESH_SKEW_SECONDS = 10; // refresh this many seconds before actual expiry

interface AuthState {
  isAuthenticated: boolean;
  displayName: string | null;
  accessToken: string | null;
  accessExpiresAt: number | null; // unix seconds
  lastRefreshAt: number | null;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  secondsUntilRefresh: number | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    displayName: null,
    accessToken: null,
    accessExpiresAt: null,
    lastRefreshAt: null,
  });
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState<number | null>(null);

  const refreshTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
    refreshTimerRef.current = null;
    tickTimerRef.current = null;
  }, []);

  const logout = useCallback(() => {
    clearTimers();
    refreshTokenRef.current = null;
    setSecondsUntilRefresh(null);
    setState({
      isAuthenticated: false,
      displayName: null,
      accessToken: null,
      accessExpiresAt: null,
      lastRefreshAt: null,
    });
  }, [clearTimers]);

  const scheduleRefresh = useCallback(
    (accessPayload: TokenPayload) => {
      clearTimers();

      const msUntilRefresh = Math.max(0, (accessPayload.exp - REFRESH_SKEW_SECONDS - Math.floor(Date.now() / 1000)) * 1000);

      tickTimerRef.current = window.setInterval(() => {
        setSecondsUntilRefresh((prev) => (prev !== null ? Math.max(0, prev - 1) : prev));
      }, 1000);
      setSecondsUntilRefresh(Math.round(msUntilRefresh / 1000));

      refreshTimerRef.current = window.setTimeout(() => {
        silentRefresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, msUntilRefresh);
    },
    // silentRefresh is defined below with useCallback and stable identity via ref pattern
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearTimers]
  );

  const silentRefresh = useCallback(() => {
    const rt = refreshTokenRef.current;
    const refreshPayload = rt ? decodeToken(rt) : null;

    if (!refreshPayload || isExpired(refreshPayload)) {
      // Refresh token itself has expired (or session is gone) — the mocked
      // session can't be silently renewed, so the user is signed out.
      logout();
      return;
    }

    const newAccess = createToken(refreshPayload.sub, refreshPayload.name, ACCESS_TTL_SECONDS, 'access');
    const newAccessPayload = decodeToken(newAccess)!;

    setState((prev) => ({
      ...prev,
      accessToken: newAccess,
      accessExpiresAt: newAccessPayload.exp,
      lastRefreshAt: Math.floor(Date.now() / 1000),
    }));
    scheduleRefresh(newAccessPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, scheduleRefresh]);

  const login = useCallback(
    (username: string, password: string): { ok: boolean; error?: string } => {
      if (username.trim().toLowerCase() !== DEMO_CREDENTIALS.username || password !== DEMO_CREDENTIALS.password) {
        return { ok: false, error: 'Those credentials were not recognized. Use the demo login shown below.' };
      }

      const displayName = username.trim();
      const access = createToken(displayName, displayName, ACCESS_TTL_SECONDS, 'access');
      const refresh = createToken(displayName, displayName, REFRESH_TTL_SECONDS, 'refresh');
      const accessPayload = decodeToken(access)!;

      refreshTokenRef.current = refresh;
      setState({
        isAuthenticated: true,
        displayName,
        accessToken: access,
        accessExpiresAt: accessPayload.exp,
        lastRefreshAt: Math.floor(Date.now() / 1000),
      });
      scheduleRefresh(accessPayload);
      return { ok: true };
    },
    [scheduleRefresh]
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, secondsUntilRefresh }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
