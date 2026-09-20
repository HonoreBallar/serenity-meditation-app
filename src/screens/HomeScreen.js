/**
 * Home screen (US-03).
 * Header with the logo and the settings gear, the API-backed quote card (US-07),
 * a category filter and the session list.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SESSIONS, CATEGORIES } from '../services/sessions';
import { fetchDailyQuote } from '../services/api';
import Logo from '../components/Logo';
import SessionCard from '../components/SessionCard';

export default function HomeScreen({ navigation }) {
  const { theme, user, isFavorite, toggleFavorite } = useApp();

  const [category, setCategory] = useState('All');
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  const loadQuote = useCallback(async () => {
    setLoadingQuote(true);
    const result = await fetchDailyQuote();
    setQuote(result);
    setLoadingQuote(false);
  }, []);

  useEffect(() => { loadQuote(); }, [loadQuote]);

  const visible = category === 'All'
    ? SESSIONS
    : SESSIONS.filter((s) => s.category === category);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {/* Header with the logo (deliverable 12) and the settings gear (deliverable 22) */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Logo theme={theme} />
        <TouchableOpacity
          testID="settings-menu-icon"
          onPress={() => navigation.navigate('Settings')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[styles.gear, { backgroundColor: theme.surfaceAlt }]}
        >
          <MaterialCommunityIcons name="cog-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hello, {user?.username || 'friend'}
            </Text>
            <Text style={[styles.sub, { color: theme.textMuted }]}>
              What would you like to practise today?
            </Text>

            {/* External API integration — deliverables 19 & 20 */}
            <View
              testID="api-quote-card"
              style={[styles.quoteCard, { backgroundColor: theme.primary }]}
            >
              <View style={styles.quoteTop}>
                <MaterialCommunityIcons name="format-quote-open" size={20} color="#FFFFFFCC" />
                <Text style={styles.quoteLabel}>DAILY INSPIRATION</Text>
                <TouchableOpacity
                  testID="refresh-quote"
                  onPress={loadQuote}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons name="refresh" size={18} color="#FFFFFFCC" />
                </TouchableOpacity>
              </View>

              {loadingQuote ? (
                <ActivityIndicator color="#FFFFFF" style={{ marginVertical: 18 }} />
              ) : (
                <>
                  <Text style={styles.quoteText}>"{quote?.content}"</Text>
                  <Text style={styles.quoteAuthor}>— {quote?.author}</Text>
                  <Text style={styles.quoteSource}>
                    {quote?.source === 'api' ? 'fetched from dummyjson.com' : 'offline quote'}
                  </Text>
                </>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {CATEGORIES.map((cat) => {
                const active = cat === category;
                return (
                  <TouchableOpacity
                    key={cat}
                    testID={`filter-${cat}`}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active ? theme.primary : theme.surface,
                        borderColor: active ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        { color: active ? '#FFFFFF' : theme.textMuted },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {category === 'All' ? 'All sessions' : `${category} sessions`}
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
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  gear: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20, paddingBottom: 40 },
  greeting: { fontSize: 24, fontWeight: '700' },
  sub: { fontSize: 14.5, marginTop: 5 },
  quoteCard: { borderRadius: 20, padding: 18, marginTop: 20 },
  quoteTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  quoteLabel: { flex: 1, color: '#FFFFFFCC', fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  quoteText: { color: '#FFFFFF', fontSize: 15.5, lineHeight: 23, fontWeight: '500' },
  quoteAuthor: { color: '#FFFFFFDD', fontSize: 13.5, fontWeight: '700', marginTop: 10 },
  quoteSource: { color: '#FFFFFF88', fontSize: 11, marginTop: 6, fontStyle: 'italic' },
  filters: { gap: 8, paddingVertical: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, borderWidth: 1.5 },
  filterText: { fontSize: 13.5, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
});
