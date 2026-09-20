/**
 * Single application context: authentication, favorites and settings.
 * Every mutation is mirrored into AsyncStorage (US-06).
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as storage from '../services/storage';
import { lightTheme, darkTheme } from '../theme/colors';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState(storage.DEFAULT_SETTINGS);
  const [booting, setBooting] = useState(true);

  // Restore everything that was persisted on the previous run.
  useEffect(() => {
    (async () => {
      const [session, favs, saved] = await Promise.all([
        storage.getSession(),
        storage.getFavorites(),
        storage.getSettings(),
      ]);
      if (session) setUser(session);
      setFavorites(favs);
      setSettings({ ...storage.DEFAULT_SETTINGS, ...saved });
      setBooting(false);
    })();
  }, []);

  /* ---------- Auth (US-01, US-02) ---------- */

  async function signup({ username, email, password }) {
    const existing = await storage.findUserByEmail(email);
    if (existing) {
      return { ok: false, error: 'An account already exists for this email address.' };
    }
    const account = {
      id: `u_${Date.now()}`,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    };
    await storage.addUser(account);
    await storage.saveSession(account);
    setUser(account);
    return { ok: true, user: account };
  }

  async function login({ email, password }) {
    const account = await storage.findUserByEmail(email);
    if (!account) {
      return { ok: false, error: 'No account found for this email address.' };
    }
    if (account.password !== password) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }
    await storage.saveSession(account);
    setUser(account);
    return { ok: true, user: account };
  }

  async function logout() {
    await storage.clearSession();
    setUser(null);
  }

  /* ---------- Favorites (US-05) ---------- */

  async function toggleFavorite(sessionId) {
    const next = favorites.includes(sessionId)
      ? favorites.filter((id) => id !== sessionId)
      : [...favorites, sessionId];
    setFavorites(next);
    await storage.saveFavorites(next);
    return next;
  }

  const isFavorite = (sessionId) => favorites.includes(sessionId);

  /* ---------- Settings (US-08) ---------- */

  async function updateSetting(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await storage.saveSettings(next);
    return next;
  }

  const theme = settings.darkMode ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({
      user, booting, theme,
      favorites, settings,
      signup, login, logout,
      toggleFavorite, isFavorite,
      updateSetting,
    }),
    [user, booting, favorites, settings, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside an AppProvider');
  return ctx;
}
