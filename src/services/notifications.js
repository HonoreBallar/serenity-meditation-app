/**
 * Notification service (US-09).
 *
 * On iOS and Android this wraps expo-notifications: permissions, an immediate
 * test notification and a repeating daily meditation reminder.
 *
 * expo-notifications has no full web implementation, so on web the same four
 * functions are backed by the browser's own Notification API. That keeps the
 * screen functional in every target rather than showing a dead button.
 */
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

/* ------------------------------------------------------------------ */
/* Web implementation — browser Notification API                       */
/* ------------------------------------------------------------------ */

const webTimers = new Set();
let webScheduled = [];

const webImpl = {
  supported: () => typeof window !== 'undefined' && 'Notification' in window,

  async getPermissionStatus() {
    if (!webImpl.supported()) return 'unsupported';
    const p = window.Notification.permission; // 'default' | 'granted' | 'denied'
    return p === 'default' ? 'undetermined' : p;
  },

  async requestPermissions() {
    if (!webImpl.supported()) return 'unsupported';
    const result = await window.Notification.requestPermission();
    return result === 'default' ? 'undetermined' : result;
  },

  async sendTestNotification() {
    if (!webImpl.supported()) throw new Error('Notifications are not supported here.');
    const notification = new window.Notification('🧘 Time to breathe', {
      body: 'Your Serenity test notification arrived. Take one slow breath.',
      tag: 'serenity-test',
    });
    return notification;
  },

  async scheduleDailyReminder(hour = 8, minute = 0) {
    await webImpl.cancelAllReminders();

    // Fire at the next occurrence of hour:minute, then every 24 hours.
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);

    const delay = next.getTime() - now.getTime();
    const timer = setTimeout(function fire() {
      if (webImpl.supported() && window.Notification.permission === 'granted') {
        new window.Notification('🌿 Your daily practice', {
          body: 'A few minutes of stillness are waiting for you.',
          tag: 'serenity-daily',
        });
      }
      const repeat = setTimeout(fire, 24 * 60 * 60 * 1000);
      webTimers.add(repeat);
    }, delay);

    webTimers.add(timer);
    webScheduled = [
      {
        identifier: 'serenity-daily',
        content: { title: '🌿 Your daily practice' },
        trigger: { hour, minute, repeats: true },
      },
    ];
    return 'serenity-daily';
  },

  async cancelAllReminders() {
    webTimers.forEach(clearTimeout);
    webTimers.clear();
    webScheduled = [];
  },

  async getScheduledReminders() {
    return webScheduled;
  },
};

/* ------------------------------------------------------------------ */
/* Native implementation — expo-notifications                          */
/* ------------------------------------------------------------------ */

let Notifications = null;
if (!isWeb) {
  // Required lazily so the web bundle never pulls in the native module.
  Notifications = require('expo-notifications');

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const nativeImpl = {
  async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Meditation reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6C4FD8',
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return 'granted';

    const { status } = await Notifications.requestPermissionsAsync();
    return status;
  },

  async getPermissionStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  },

  async sendTestNotification() {
    return Notifications.scheduleNotificationAsync({
      content: {
        title: '🧘 Time to breathe',
        body: 'Your Serenity test notification arrived. Take one slow breath.',
        data: { type: 'test' },
      },
      trigger: null,
    });
  },

  async scheduleDailyReminder(hour = 8, minute = 0) {
    await nativeImpl.cancelAllReminders();
    return Notifications.scheduleNotificationAsync({
      content: {
        title: '🌿 Your daily practice',
        body: 'A few minutes of stillness are waiting for you.',
        data: { type: 'daily-reminder' },
      },
      trigger: { hour, minute, repeats: true },
    });
  },

  async cancelAllReminders() {
    return Notifications.cancelAllScheduledNotificationsAsync();
  },

  async getScheduledReminders() {
    return Notifications.getAllScheduledNotificationsAsync();
  },
};

/* ------------------------------------------------------------------ */
/* Public API — identical signatures on every platform                 */
/* ------------------------------------------------------------------ */

const impl = isWeb ? webImpl : nativeImpl;

export const requestPermissions = (...args) => impl.requestPermissions(...args);
export const getPermissionStatus = (...args) => impl.getPermissionStatus(...args);
export const sendTestNotification = (...args) => impl.sendTestNotification(...args);
export const scheduleDailyReminder = (...args) => impl.scheduleDailyReminder(...args);
export const cancelAllReminders = (...args) => impl.cancelAllReminders(...args);
export const getScheduledReminders = (...args) => impl.getScheduledReminders(...args);
