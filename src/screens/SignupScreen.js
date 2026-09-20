/**
 * Sign-up screen (US-01).
 * Three fields — username, email, password — a Sign Up button and a Log in link.
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

export default function SignupScreen({ navigation }) {
  const { theme, signup } = useApp();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /** Client-side validation for the three fields. */
  function validate() {
    const next = {};
    if (!username.trim()) next.username = 'Username is required.';
    else if (username.trim().length < 3) next.username = 'Username must be at least 3 characters.';

    if (!email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';

    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSignup() {
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    const result = await signup({ username, email, password });
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
    }
    // On success the root navigator swaps to the app stack automatically.
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Logo theme={theme} size="lg" />
          <Text style={[styles.title, { color: theme.text }]}>Create your account</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Start your meditation practice today.
          </Text>
        </View>

        <View style={styles.form}>
          <Field
            testID="signup-username"
            theme={theme}
            label="Username"
            icon="account-outline"
            value={username}
            onChangeText={setUsername}
            placeholder="your name"
            error={errors.username}
          />
          <Field
            testID="signup-email"
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
            testID="signup-password"
            theme={theme}
            label="Password"
            icon="lock-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="at least 6 characters"
            secureTextEntry
            error={errors.password}
          />

          {formError ? (
            <View
              testID="signup-error"
              style={[styles.banner, { backgroundColor: theme.danger + '1A', borderColor: theme.danger }]}
            >
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.danger} />
              <Text style={[styles.bannerText, { color: theme.danger }]}>{formError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            testID="signup-submit"
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={handleSignup}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Already have an account?
            </Text>
            <TouchableOpacity testID="signup-login-link" onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.link, { color: theme.primary }]}> Log in</Text>
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
