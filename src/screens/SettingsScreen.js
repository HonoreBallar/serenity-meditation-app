/**
 * Settings screen (US-08).
 * Sections: Account, Preferences, Notifications, Local storage, About.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { dumpStorage } from '../services/storage';

function Row({ theme, icon, label, hint, right, onPress, testID }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      testID={testID}
      style={[styles.row, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.rowIcon, { backgroundColor: theme.primarySoft }]}>
        <MaterialCommunityIcons name={icon} size={19} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
        {hint ? <Text style={[styles.rowHint, { color: theme.textMuted }]}>{hint}</Text> : null}
      </View>
      {right}
    </Wrapper>
  );
}

export default function SettingsScreen({ navigation }) {
  const { theme, user, settings, updateSetting, logout, favorites } = useApp();
  const [storageDump, setStorageDump] = useState([]);

  // Deliverable 17: display what is actually held in local storage.
  useEffect(() => {
    dumpStorage().then(setStorageDump);
  }, [settings, favorites]);

  function handleLogout() {
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Sign out of Serenity?')) logout();
      return;
    }
    Alert.alert('Sign out', 'Sign out of Serenity?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          testID="settings-back"
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={23} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 23 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ---- Account ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>ACCOUNT</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row theme={theme} icon="account-outline" label={user?.username || '—'} hint={user?.email} />
          <Row
            testID="settings-profile"
            theme={theme}
            icon="account-edit-outline"
            label="Edit profile"
            onPress={() => {}}
            right={<MaterialCommunityIcons name="chevron-right" size={21} color={theme.textMuted} />}
          />
        </View>

        {/* ---- Preferences ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>PREFERENCES</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row
            testID="setting-dark-mode"
            theme={theme}
            icon="weather-night"
            label="Dark mode"
            hint="Softer colours for evening practice"
            right={
              <Switch
                value={settings.darkMode}
                onValueChange={(v) => updateSetting('darkMode', v)}
                trackColor={{ true: theme.primary, false: theme.border }}
              />
            }
          />
          <Row
            testID="setting-sounds"
            theme={theme}
            icon="volume-high"
            label="Ambient sounds"
            hint="Play background audio during sessions"
            right={
              <Switch
                value={settings.sounds}
                onValueChange={(v) => updateSetting('sounds', v)}
                trackColor={{ true: theme.primary, false: theme.border }}
              />
            }
          />
          <Row
            testID="setting-reminder"
            theme={theme}
            icon="bell-ring-outline"
            label="Daily reminder"
            hint={`Remind me at ${String(settings.reminderHour).padStart(2, '0')}:00`}
            right={
              <Switch
                value={settings.dailyReminder}
                onValueChange={(v) => updateSetting('dailyReminder', v)}
                trackColor={{ true: theme.primary, false: theme.border }}
              />
            }
          />
        </View>

        {/* ---- Notifications ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>NOTIFICATIONS</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row
            testID="settings-notifications"
            theme={theme}
            icon="bell-outline"
            label="Notification setup"
            hint="Permissions, schedule and test alert"
            onPress={() => navigation.navigate('Notifications')}
            right={<MaterialCommunityIcons name="chevron-right" size={21} color={theme.textMuted} />}
          />
        </View>

        {/* ---- Local storage evidence (deliverable 17) ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>LOCAL STORAGE</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View testID="storage-dump" style={styles.dump}>
            {storageDump.length === 0 ? (
              <Text style={[styles.dumpEmpty, { color: theme.textMuted }]}>Nothing stored yet.</Text>
            ) : (
              storageDump.map(({ key, value }) => (
                <View key={key} style={styles.dumpRow}>
                  <Text style={[styles.dumpKey, { color: theme.primary }]}>{key}</Text>
                  <Text style={[styles.dumpValue, { color: theme.textMuted }]} numberOfLines={3}>
                    {value}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* ---- About ---- */}
        <Text style={[styles.section, { color: theme.textMuted }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row theme={theme} icon="information-outline" label="Version" hint="Serenity 1.0.0" />
          <Row
            theme={theme}
            icon="shield-check-outline"
            label="Privacy policy"
            onPress={() => {}}
            right={<MaterialCommunityIcons name="chevron-right" size={21} color={theme.textMuted} />}
          />
        </View>

        <TouchableOpacity
          testID="settings-logout"
          onPress={handleLogout}
          style={[styles.logout, { borderColor: theme.danger, backgroundColor: theme.surface }]}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="logout" size={19} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>Sign out</Text>
        </TouchableOpacity>
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
  section: { fontSize: 11.5, fontWeight: '800', letterSpacing: 1.1, marginTop: 22, marginBottom: 9 },
  card: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, borderBottomWidth: 1 },
  rowIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowHint: { fontSize: 12.5, marginTop: 3 },
  dump: { padding: 15, gap: 12 },
  dumpEmpty: { fontSize: 13.5, fontStyle: 'italic' },
  dumpRow: { gap: 3 },
  dumpKey: { fontSize: 12, fontWeight: '800', fontFamily: 'monospace' },
  dumpValue: { fontSize: 11.5, fontFamily: 'monospace', lineHeight: 16 },
  logout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    height: 52, borderRadius: 14, borderWidth: 1.5, marginTop: 28,
  },
  logoutText: { fontSize: 15, fontWeight: '700' },
});
