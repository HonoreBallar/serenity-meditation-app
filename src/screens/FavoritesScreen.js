/**
 * Favorites / profile screen (US-05).
 * Shows the signed-in user and every session they saved.
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SESSIONS } from '../services/sessions';
import SessionCard from '../components/SessionCard';

export default function FavoritesScreen({ navigation }) {
  const { theme, user, favorites, isFavorite, toggleFavorite } = useApp();
  const saved = SESSIONS.filter((s) => favorites.includes(s.id));
  const totalMinutes = saved.reduce((sum, s) => sum + s.duration, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Profile block */}
            <View style={[styles.profile, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>
                  {(user?.username || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]}>{user?.username}</Text>
                <Text style={[styles.email, { color: theme.textMuted }]}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.stat, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.statValue, { color: theme.primary }]}>{saved.length}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Favorites</Text>
              </View>
              <View style={[styles.stat, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.statValue, { color: theme.accent }]}>{totalMinutes}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Minutes saved</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Your favorites</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="heart-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No favorites yet</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Tap the heart on any session to keep it here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            theme={theme}
            isFavorite={isFavorite(item.id)}
            onPress={() => navigation.navigate('Detail', { sessionId: item.id })}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: 20, paddingBottom: 40 },
  profile: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderRadius: 20, padding: 16,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700' },
  email: { fontSize: 13.5, marginTop: 3 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  stat: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 25, fontWeight: '700' },
  statLabel: { fontSize: 12.5, marginTop: 4, fontWeight: '500' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 26, marginBottom: 14 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 6 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
