import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/** The Serenity mark used in the auth screens and the home header. */
export default function Logo({ theme, size = 'md', showWordmark = true }) {
  const dim = size === 'lg' ? 64 : size === 'sm' ? 30 : 40;
  const iconSize = size === 'lg' ? 36 : size === 'sm' ? 18 : 24;
  const fontSize = size === 'lg' ? 28 : size === 'sm' ? 16 : 20;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.badge,
          { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: theme.primary },
        ]}
      >
        <MaterialCommunityIcons name="meditation" size={iconSize} color="#FFFFFF" />
      </View>
      {showWordmark && (
        <Text style={[styles.word, { color: theme.text, fontSize }]}>Serenity</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { alignItems: 'center', justifyContent: 'center' },
  word: { fontWeight: '700', letterSpacing: 0.3 },
});
