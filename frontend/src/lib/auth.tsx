import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api, ApiError, clearStoredToken, getStoredToken, setStoredToken } from "./api";
import type { Role, User } from "./types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [authError, setAuthError] = useState<string | null>(null);

  const userQuery = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: api.getCurrentUser,
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!(userQuery.error instanceof ApiError)) {
      return;
    }

    if (userQuery.error.status === 401) {
      clearStoredToken();
      setToken(null);
      setAuthError("Your session expired. Please sign in again.");
      queryClient.removeQueries({ queryKey: ["auth"] });
    }
  }, [queryClient, userQuery.error]);

  const value = useMemo<AuthContextValue>(() => {
    const user = userQuery.data ?? null;

    return {
      token,
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token && user),
      isLoading: Boolean(token) && userQuery.isLoading,
      error: authError,
      login: async (username: string, password: string) => {
        const response = await api.login(username, password);
        setStoredToken(response.access_token);
        setToken(response.access_token);
        setAuthError(null);
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
        await queryClient.refetchQueries({ queryKey: ["auth", "me", response.access_token] });
      },
      logout: () => {
        clearStoredToken();
        setToken(null);
        setAuthError(null);
        queryClient.removeQueries({ queryKey: ["auth"] });
      },
      refreshUser: async () => {
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
      },
    };
  }, [authError, queryClient, token, userQuery.data, userQuery.isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
