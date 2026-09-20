import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/** A labelled text input with an icon and an inline error slot. */
export default function Field({
  theme, label, icon, value, onChangeText,
  placeholder, secureTextEntry, keyboardType, autoCapitalize, error, testID,
}) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={error ? theme.danger : theme.textMuted}
        />
        <TextInput
          testID={testID}
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
        />
      </View>
      {error ? (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, letterSpacing: 0.2 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, height: 52,
  },
  input: { flex: 1, fontSize: 15, height: '100%' },
  error: { fontSize: 12.5, marginTop: 5, fontWeight: '500' },
});
