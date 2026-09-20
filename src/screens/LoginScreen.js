/**
 * Login screen (US-02).
 * Two fields — email and password — a Log In button and a Sign up link.
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import Field from '../components/Field';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { theme, login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleLogin() {
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    const result = await login({ email, password });
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Logo theme={theme} size="lg" />
          <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Sign in to continue your practice.
          </Text>
        </View>

        <View style={styles.form}>
          <Field
            testID="login-email"
            theme={theme}
            label="Email"
            icon="email-outline"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={errors.email}
          />
          <Field
            testID="login-password"
            theme={theme}
            label="Password"
            icon="lock-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="your password"
            secureTextEntry
            error={errors.password}
          />

          {formError ? (
            <View
              testID="login-error"
              style={[styles.banner, { backgroundColor: theme.danger + '1A', borderColor: theme.danger }]}
            >
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.danger} />
              <Text style={[styles.bannerText, { color: theme.danger }]}>{formError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            testID="login-submit"
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity testID="login-signup-link" onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.link, { color: theme.primary }]}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 48 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 25, fontWeight: '700', marginTop: 20 },
  subtitle: { fontSize: 14.5, marginTop: 7, textAlign: 'center' },
  form: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 14,
  },
  bannerText: { flex: 1, fontSize: 13.5, fontWeight: '500' },
  primaryBtn: {
    height: 54, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginTop: 8,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '700' },
});
