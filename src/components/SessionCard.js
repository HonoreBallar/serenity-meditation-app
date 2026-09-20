import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * One meditation session in the home list.
 * Carries the favorite toggle (US-05) and the navigation chevron (US-04).
 */
export default function SessionCard({ session, theme, isFavorite, onPress, onToggleFavorite }) {
  return (
    <TouchableOpacity
      testID={`session-card-${session.id}`}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, { backgroundColor: session.color + '22' }]}>
        <MaterialCommunityIcons name={session.icon} size={26} color={session.color} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {session.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.pill, { backgroundColor: theme.primarySoft }]}>
            <Text style={[styles.pillText, { color: theme.primary }]}>{session.category}</Text>
          </View>
          <MaterialCommunityIcons name="clock-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.meta, { color: theme.textMuted }]}>{session.duration} min</Text>
        </View>
      </View>

      <TouchableOpacity
        testID={`favorite-toggle-${session.id}`}
        onPress={onToggleFavorite}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.heart}
      >
        <MaterialCommunityIcons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={21}
          color={isFavorite ? theme.danger : theme.textMuted}
        />
      </TouchableOpacity>

      <MaterialCommunityIcons
        testID={`navigate-${session.id}`}
        name="chevron-right"
        size={24}
        color={theme.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 12,
  },
  iconBox: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
  title: { fontSize: 15.5, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  pill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  pillText: { fontSize: 11.5, fontWeight: '700' },
  meta: { fontSize: 12.5, fontWeight: '500' },
  heart: { padding: 4 },
});
