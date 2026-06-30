'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  authLogin,
  authRegister,
  authLogout,
  authRefresh,
  authGetMe,
  setAuthCallbacks,
  updateLocalToken,
} from '@/lib/api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setAuthCallbacks({
      onTokenRefreshed: (token) => {
        setAccessToken(token);
        updateLocalToken(token);
      },
      onLogout: () => {
        setAccessToken(null);
        setUser(null);
        updateLocalToken(null);
        document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/login');
      },
    });

    authRefresh()
      .then(async ({ data }) => {
        const token = data.accessToken;
        setAccessToken(token);
        updateLocalToken(token);
        document.cookie = 'isAuthenticated=true; path=/; max-age=604800';

        const meRes = await authGetMe();
        setUser(meRes.data.data);
      })
      .catch(() => {
        // No cookie present, or cookie expired — user must log in.
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const { data } = await authLogin({ email, password, rememberMe });
    const token = data.accessToken;

    setAccessToken(token);
    updateLocalToken(token);
    document.cookie = 'isAuthenticated=true; path=/; max-age=604800';

    const meRes = await authGetMe();
    const me = meRes.data.data;
    setUser(me);

    // Redirect admins to /admin if they came via ?redirect=admin
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTarget = searchParams.get('redirect');
    if (me?.role === 'admin' && redirectTarget === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/');
    }
  }, [router]);

  const register = useCallback(async ({ name, email, password, confirmPassword }) => {
    await authRegister({ name, email, password, confirmPassword });
    router.replace('/login?registered=1');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } catch {
      // Still clear local state if network fails.
    }
    setAccessToken(null);
    setUser(null);
    updateLocalToken(null);
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.replace('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
