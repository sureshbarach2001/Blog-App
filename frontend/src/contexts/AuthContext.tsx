"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import axios from "axios";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/register", { username, email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await axios.post("http://localhost:5000/api/auth/logout", {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      queryClient.clear();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}