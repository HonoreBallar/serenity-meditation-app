/**
 * Local storage layer (US-06).
 * Every key is namespaced under @serenity: so the app never collides with
 * anything else stored on the device.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@serenity:';

export const KEYS = {
  USERS: `${PREFIX}users`,
  SESSION: `${PREFIX}session`,
  FAVORITES: `${PREFIX}favorites`,
  SETTINGS: `${PREFIX}settings`,
};

async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`[storage] read failed for ${key}`, error);
    return fallback;
  }
}

async function writeJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] write failed for ${key}`, error);
    return false;
  }
}

/* ---------- Accounts ---------- */

export const getUsers = () => readJSON(KEYS.USERS, []);
export const saveUsers = (users) => writeJSON(KEYS.USERS, users);

export async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function addUser(user) {
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);
  return user;
}

/* ---------- Active session ---------- */

export const getSession = () => readJSON(KEYS.SESSION, null);
export const saveSession = (user) => writeJSON(KEYS.SESSION, user);
export const clearSession = () => AsyncStorage.removeItem(KEYS.SESSION);

/* ---------- Favorites ---------- */

export const getFavorites = () => readJSON(KEYS.FAVORITES, []);
export const saveFavorites = (ids) => writeJSON(KEYS.FAVORITES, ids);

/* ---------- Settings ---------- */

export const DEFAULT_SETTINGS = {
  darkMode: false,
  dailyReminder: false,
  sounds: true,
  reminderHour: 8,
};

export const getSettings = () => readJSON(KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveSettings = (settings) => writeJSON(KEYS.SETTINGS, settings);

/** Debug helper used by the persistence evidence screen. */
export async function dumpStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const serenityKeys = keys.filter((k) => k.startsWith(PREFIX));
  const entries = await AsyncStorage.multiGet(serenityKeys);
  return entries.map(([key, value]) => ({ key, value }));
}
