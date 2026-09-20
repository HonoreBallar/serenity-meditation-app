/**
 * Detail screen (US-04).
 * Full information for one session plus the favorite toggle.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getSessionById } from '../services/sessions';

export default function DetailScreen({ route, navigation }) {
  const { theme, isFavorite, toggleFavorite } = useApp();
  const session = getSessionById(route.params?.sessionId);

  if (!session) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text, padding: 24 }}>Session not found.</Text>
      </SafeAreaView>
    );
  }

  const favorited = isFavorite(session.id);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity
          testID="detail-back"
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="arrow-left" size={21} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="detail-favorite"
          onPress={() => toggleFavorite(session.id)}
          style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons
            name={favorited ? 'heart' : 'heart-outline'}
            size={21}
            color={favorited ? theme.danger : theme.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: session.color + '22' }]}>
          <MaterialCommunityIcons name={session.icon} size={62} color={session.color} />
        </View>

        <Text testID="detail-title" style={[styles.title, { color: theme.text }]}>
          {session.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.pill, { backgroundColor: theme.primarySoft }]}>
            <Text style={[styles.pillText, { color: theme.primary }]}>{session.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={15} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>{session.duration} min</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="account-voice" size={15} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>{session.narrator}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>About this session</Text>
        <Text style={[styles.body, { color: theme.textMuted }]}>{session.description}</Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Benefits</Text>
        {session.benefits.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <MaterialCommunityIcons name="check-circle" size={17} color={theme.accent} />
            <Text style={[styles.benefitText, { color: theme.textMuted }]}>{benefit}</Text>
          </View>
        ))}

        <TouchableOpacity
          testID="detail-start"
          style={[styles.startBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="play-circle-outline" size={21} color="#FFFFFF" />
          <Text style={styles.startText}>Start session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="detail-favorite-btn"
          onPress={() => toggleFavorite(session.id)}
          style={[
            styles.favBtn,
            { borderColor: favorited ? theme.danger : theme.border, backgroundColor: theme.surface },
          ]}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name={favorited ? 'heart' : 'heart-outline'}
            size={19}
            color={favorited ? theme.danger : theme.text}
          />
          <Text style={[styles.favText, { color: favorited ? theme.danger : theme.text }]}>
            {favorited ? 'Remove from favorites' : 'Add to favorites'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { padding: 20, paddingTop: 4, paddingBottom: 44 },
  hero: { height: 160, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  title: { fontSize: 26, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13.5, fontWeight: '500' },
  pill: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 },
  pillText: { fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 26, marginBottom: 10 },
  body: { fontSize: 14.5, lineHeight: 23 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 },
  benefitText: { fontSize: 14.5, flex: 1 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    height: 54, borderRadius: 14, marginTop: 30,
  },
  startText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  favBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    height: 52, borderRadius: 14, marginTop: 12, borderWidth: 1.5,
  },
  favText: { fontSize: 15, fontWeight: '700' },
});
