# User Stories — Serenity Meditation App

**Project:** Serenity — a mobile meditation companion
**Author:** Honoré Amounan
**Platform:** React Native (Expo)

---

## Overview

Serenity helps people build a daily meditation habit. Users create an account, browse
guided sessions, open a session to see its details, save the ones they love, pull a
daily inspirational quote from an external API, tune their preferences, and receive a
reminder notification when it is time to sit.

The nine user stories below drive every screen and feature in the application.

---

## US-01 — User Registration

**As a** new visitor
**I want to** create an account with a username, an email address and a password
**So that** my meditation history and favorites are tied to me and persist between visits.

**Acceptance criteria**

- The sign-up screen exposes exactly three input fields: username, email, password.
- A primary **Sign Up** button submits the form.
- A **Log in** link routes an existing user to the login screen.
- The username must be at least 3 characters long.
- The email must match a standard email pattern.
- The password must be at least 6 characters long.
- Submitting an email that is already registered shows an inline error and blocks the account creation.
- On success the account is written to local storage and the user lands on the Home screen.

---

## US-02 — User Login

**As a** returning user
**I want to** sign in with my email and my password
**So that** I get back to my sessions and my saved favorites.

**Acceptance criteria**

- The login screen exposes exactly two input fields: email and password.
- A primary **Log In** button submits the credentials.
- A **Sign up** link routes a new user to the registration screen.
- Credentials are checked against the accounts held in local storage.
- An unknown email or a wrong password shows a clear error message and keeps the user on the screen.
- On success the session is persisted and the user lands on the Home screen.

---

## US-03 — Browse Meditation Sessions (Home)

**As a** signed-in user
**I want to** see the catalogue of guided meditation sessions on the home screen
**So that** I can pick the practice that fits my current mood.

**Acceptance criteria**

- A header displays the application logo and the application name.
- Sessions render in a scrollable list, each card showing the title, the category, the duration and an illustrative icon.
- A category filter row lets the user narrow the list (All, Calm, Focus, Sleep, Breath).
- A greeting addresses the user by their username.
- Tapping a card navigates to that session's detail screen.

---

## US-04 — View Session Details

**As a** user browsing the catalogue
**I want to** open a session and read everything about it
**So that** I know what the practice involves before I commit my time to it.

**Acceptance criteria**

- Each home card exposes a navigation chevron icon that opens the detail screen.
- The detail screen shows the title, the category, the duration, the narrator, the full description and the list of benefits.
- A back control returns the user to the home screen.
- A **Favorite** control on the detail screen adds or removes the session from the favorites.

---

## US-05 — Save Favorites

**As a** user with practices I return to
**I want to** mark sessions as favorites and find them grouped in one place
**So that** I can start a familiar practice without searching the whole catalogue.

**Acceptance criteria**

- A heart control on the home cards and on the detail screen toggles the favorite state.
- The favorites tab lists every saved session.
- The favorite state survives a full restart of the application.
- When nothing is saved, the favorites tab shows an explanatory empty state.

---

## US-06 — Persist Data Locally

**As a** user
**I want** my account, my session and my favorites stored on the device
**So that** I am not asked to sign in again and my choices are never lost.

**Acceptance criteria**

- Accounts, the active session and the favorites are written to AsyncStorage.
- Relaunching the application restores the signed-in user straight to the Home screen.
- Signing out clears the active session but preserves the registered accounts.
- Every storage read and write is namespaced under a dedicated key prefix.

---

## US-07 — Daily Inspiration from an External API

**As a** user opening the application
**I want to** receive a fresh inspirational quote fetched from an external service
**So that** my practice starts with a moment of reflection.

**Acceptance criteria**

- The home screen calls a public REST API to retrieve a quote and its author.
- A loading indicator shows while the request is in flight.
- A network failure falls back to a bundled local quote instead of breaking the screen.
- A refresh control fetches another quote on demand.

---

## US-08 — Configure Settings

**As a** user
**I want to** reach a settings menu and adjust the application to my liking
**So that** the experience matches my routine and my preferences.

**Acceptance criteria**

- A gear icon in the home header opens the settings screen.
- The settings screen groups its items into sections: Account, Preferences, Notifications, About.
- Preferences include a dark mode toggle, a daily reminder toggle and a sound toggle.
- Every preference is persisted locally and reapplied on the next launch.
- A **Sign out** item ends the session and returns the user to the login screen.

---

## US-09 — Receive Meditation Reminders

**As a** user building a habit
**I want to** receive a notification reminding me to meditate
**So that** I keep my streak without having to remember on my own.

**Acceptance criteria**

- The notification screen requests the operating system permission explicitly.
- The current permission status is displayed to the user.
- The user can schedule a daily reminder at a chosen hour.
- A **Send a test notification** control triggers an immediate notification so the setup can be verified.
- Scheduled reminders can be cancelled from the same screen.

---

## Traceability

| Story | Screen | Source file |
|-------|--------|-------------|
| US-01 | Sign Up | `src/screens/SignupScreen.js` |
| US-02 | Login | `src/screens/LoginScreen.js` |
| US-03 | Home | `src/screens/HomeScreen.js` |
| US-04 | Detail | `src/screens/DetailScreen.js` |
| US-05 | Favorites | `src/screens/FavoritesScreen.js` |
| US-06 | — (cross-cutting) | `src/services/storage.js` |
| US-07 | Home | `src/services/api.js` |
| US-08 | Settings | `src/screens/SettingsScreen.js` |
| US-09 | Notifications | `src/screens/NotificationsScreen.js` |
