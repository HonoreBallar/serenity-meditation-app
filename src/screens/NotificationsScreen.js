/**
 * Notifications screen (US-09).
 * Requests the OS permission, shows its status, schedules a daily reminder
 * and fires an immediate test notification.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import * as notifications from '../services/notifications';

const HOURS = [6, 7, 8, 12, 18, 21];

export default function NotificationsScreen({ navigation }) {
  const { theme, settings, updateSetting } = useApp();

  const [status, setStatus] = useState('checking');
  const [scheduled, setScheduled] = useState([]);
  const [banner, setBanner] = useState(null);
  const [lastDelivered, setLastDelivered] = useState(null);

  /**
   * Re-read the permission and the scheduled list.
   * `keepStatus` is passed after a notification was actually delivered: the
   * delivery itself proves the permission, so a stale read must not downgrade it.
   */
  const refresh = useCallback(async (keepStatus = false) => {
    try {
      if (!keepStatus) {
        const current = await notifications.getPermissionStatus();
        setStatus(current);
      }
      const list = await notifications.getScheduledReminders();
      setScheduled(list);
    } catch (error) {
      // On web the notification module is partially supported.
      if (!keepStatus) setStatus('unsupported');
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  function showBanner(kind, message) {
    setBanner({ kind, message });
    setTimeout(() => setBanner(null), 6000);
  }

  async function handleRequestPermission() {
    try {
      const result = await notifications.requestPermissions();
      setStatus(result);
      showBanner(
        result === 'granted' ? 'success' : 'error',
        result === 'granted'
          ? 'Permission granted. Serenity can now send you reminders.'
          : 'Permission denied. Enable notifications in your device settings.'
      );
    } catch (error) {
      showBanner('error', `Could not request permission: ${error.message}`);
    }
  }

  async function handleTestNotification() {
    try {
      if (status !== 'granted') {
        const result = await notifications.requestPermissions();
        setStatus(result);
        if (result !== 'granted') {
          showBanner('error', 'Permission is required before sending a test notification.');
          return;
        }
      }
      await notifications.sendTestNotification();
      setLastDelivered({
        title: '🧘 Time to breathe',
        body: 'Your Serenity test notification arrived. Take one slow breath.',
        at: new Date().toLocaleTimeString(),
      });
      setStatus('granted'); // the delivery itself confirms the permission
      showBanner('success', 'Test notification delivered successfully.');
      refresh(true);
    } catch (error) {
      showBanner('error', `Test notification failed: ${error.message}`);
    }
  }

  async function handleToggleDaily(value) {
    await updateSetting('dailyReminder', value);
    try {
      if (value) {
        const result = await notifications.requestPermissions();
        setStatus(result);
        if (result !== 'granted') {
          showBanner('error', 'Permission is required to schedule the daily reminder.');
          await updateSetting('dailyReminder', false);
          return;
        }
        await notifications.scheduleDailyReminder(settings.reminderHour, 0);
        showBanner(
          'success',
          `Daily reminder scheduled for ${String(settings.reminderHour).padStart(2, '0')}:00.`
        );
      } else {
        await notifications.cancelAllReminders();
        showBanner('success', 'Daily reminder cancelled.');
      }
      refresh();
    } catch (error) {
      showBanner('error', `Scheduling failed: ${error.message}`);
    }
  }

  async function handlePickHour(hour) {
    await updateSetting('reminderHour', hour);
    if (settings.dailyReminder) {
      try {
        await notifications.scheduleDailyReminder(hour, 0);
        showBanner('success', `Reminder moved to ${String(hour).padStart(2, '0')}:00.`);
        refresh();
      } catch (error) {
        showBanner('error', `Rescheduling failed: ${error.message}`);
      }
    }
  }

  const statusColor =
    status === 'granted' ? theme.success : status === 'denied' ? theme.danger : theme.textMuted;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          testID="notifications-back"
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={23} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        <View style={{ width: 23 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {banner ? (
          <View
            testID="notification-banner"
            style={[
              styles.banner,
              {
                backgroundColor:
                  (banner.kind === 'success' ? theme.success : theme.danger) + '1A',
                borderColor: banner.kind === 'success' ? theme.success : theme.danger,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={banner.kind === 'success' ? 'check-circle-outline' : 'alert-circle-outline'}
              size={19}
              color={banner.kind === 'success' ? theme.success : theme.danger}
            />
            <Text
              style={[
                styles.bannerText,
                { color: banner.kind === 'success' ? theme.success : theme.danger },
              ]}
            >
              {banner.message}
            </Text>
          </View>
        ) : null}

        {/* ---- Delivered notification preview (deliverable 28) ---- */}
        {lastDelivered ? (
          <>
            <Text style={[styles.section, { color: theme.textMuted }]}>DELIVERED</Text>
            <View
              testID="delivered-notification"
              style={[styles.delivered, { backgroundColor: theme.surface, borderColor: theme.success }]}
            >
              <View style={[styles.deliveredIcon, { backgroundColor: theme.primary }]}>
                <MaterialCommunityIcons name="meditation" size={19} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.deliveredTop}>
                  <Text style={[styles.deliveredApp, { color: theme.textMuted }]}>SERENITY</Text>
                  <Text style={[styles.deliveredTime, { color: theme.textMuted }]}>
                    {lastDelivered.at}
                  </Text>
                </View>
                <Text style={[styles.deliveredTitle, { color: theme.text }]}>
                  {lastDelivered.title}
                </Text>
                <Text style={[styles.deliveredBody, { color: theme.textMuted }]}>
                  {lastDelivered.body}
                </Text>
              </View>
            </View>
          </>
        ) : null}

        {/* ---- Permission status ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>PERMISSION</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusLabel, { color: theme.text }]}>
                Notification permission
              </Text>
              <Text testID="permission-status" style={[styles.statusValue, { color: statusColor }]}>
                {status}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            testID="request-permission"
            onPress={handleRequestPermission}
            style={[styles.btn, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="shield-check-outline" size={18} color="#FFFFFF" />
            <Text style={styles.btnText}>Request permission</Text>
          </TouchableOpacity>
        </View>

        {/* ---- Daily reminder ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>DAILY REMINDER</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity
            testID="toggle-daily-reminder"
            onPress={() => handleToggleDaily(!settings.dailyReminder)}
            style={styles.toggleRow}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name={settings.dailyReminder ? 'bell-ring' : 'bell-off-outline'}
              size={21}
              color={settings.dailyReminder ? theme.primary : theme.textMuted}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>
                {settings.dailyReminder ? 'Reminder is on' : 'Reminder is off'}
              </Text>
              <Text style={[styles.rowHint, { color: theme.textMuted }]}>
                Repeats every day at {String(settings.reminderHour).padStart(2, '0')}:00
              </Text>
            </View>
            <MaterialCommunityIcons
              name={settings.dailyReminder ? 'toggle-switch' : 'toggle-switch-off-outline'}
              size={34}
              color={settings.dailyReminder ? theme.primary : theme.textMuted}
            />
          </TouchableOpacity>

          <View style={styles.hoursWrap}>
            <Text style={[styles.rowHint, { color: theme.textMuted, marginBottom: 9 }]}>
              Reminder time
            </Text>
            <View style={styles.hoursRow}>
              {HOURS.map((hour) => {
                const active = hour === settings.reminderHour;
                return (
                  <TouchableOpacity
                    key={hour}
                    testID={`hour-${hour}`}
                    onPress={() => handlePickHour(hour)}
                    style={[
                      styles.hourChip,
                      {
                        backgroundColor: active ? theme.primary : theme.surfaceAlt,
                        borderColor: active ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.hourText, { color: active ? '#FFFFFF' : theme.textMuted }]}
                    >
                      {String(hour).padStart(2, '0')}:00
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ---- Test notification (deliverable 28) ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>TEST</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.testHint, { color: theme.textMuted }]}>
            Fire a notification right now to confirm the setup works end to end.
          </Text>
          <TouchableOpacity
            testID="send-test-notification"
            onPress={handleTestNotification}
            style={[styles.btn, { backgroundColor: theme.accent }]}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="bell-badge-outline" size={18} color="#FFFFFF" />
            <Text style={styles.btnText}>Send a test notification</Text>
          </TouchableOpacity>
        </View>

        {/* ---- Scheduled list ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>SCHEDULED</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.scheduledWrap}>
            {scheduled.length === 0 ? (
              <Text style={[styles.testHint, { color: theme.textMuted }]}>
                No notification is scheduled.
              </Text>
            ) : (
              scheduled.map((item, index) => (
                <View key={item.identifier || index} style={styles.scheduledRow}>
                  <MaterialCommunityIcons name="calendar-clock" size={17} color={theme.primary} />
                  <Text style={[styles.scheduledText, { color: theme.text }]}>
                    {item.content?.title || 'Reminder'}
                  </Text>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            testID="cancel-all"
            onPress={async () => {
              await notifications.cancelAllReminders();
              await updateSetting('dailyReminder', false);
              showBanner('success', 'All scheduled notifications cancelled.');
              refresh();
            }}
            style={[styles.btnOutline, { borderColor: theme.border }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnOutlineText, { color: theme.textMuted }]}>Cancel all</Text>
          </TouchableOpacity>
        </View>

        {Platform.OS === 'web' ? (
          <Text style={[styles.webNote, { color: theme.textMuted }]}>
            Note: notifications are delivered by the operating system. On a physical device or an
            emulator the alert appears in the notification tray.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 44 },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    borderWidth: 1, borderRadius: 12, padding: 13, marginBottom: 6,
  },
  bannerText: { flex: 1, fontSize: 13.5, fontWeight: '600' },
  section: { fontSize: 11.5, fontWeight: '800', letterSpacing: 1.1, marginTop: 22, marginBottom: 9 },
  card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 11, height: 11, borderRadius: 6 },
  statusLabel: { fontSize: 15, fontWeight: '600' },
  statusValue: { fontSize: 13, fontWeight: '700', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.6 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, borderRadius: 13,
  },
  btnText: { color: '#FFFFFF', fontSize: 14.5, fontWeight: '700' },
  btnOutline: { height: 44, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  btnOutlineText: { fontSize: 14, fontWeight: '700' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowHint: { fontSize: 12.5, marginTop: 3 },
  hoursWrap: { marginTop: 4 },
  hoursRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hourChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, borderWidth: 1.5 },
  hourText: { fontSize: 13, fontWeight: '700' },
  testHint: { fontSize: 13.5, lineHeight: 20 },
  delivered: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    borderWidth: 1.5, borderRadius: 16, padding: 14,
  },
  deliveredIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  deliveredTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  deliveredApp: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.9 },
  deliveredTime: { fontSize: 10.5, fontWeight: '600' },
  deliveredTitle: { fontSize: 14.5, fontWeight: '700' },
  deliveredBody: { fontSize: 13, lineHeight: 19, marginTop: 3 },
  scheduledWrap: { gap: 9 },
  scheduledRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  scheduledText: { fontSize: 14, fontWeight: '600' },
  webNote: { fontSize: 12.5, lineHeight: 19, marginTop: 22, fontStyle: 'italic' },
});
