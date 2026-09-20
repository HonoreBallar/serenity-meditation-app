# Serenity — Meditation Companion

A React Native (Expo) mobile application that helps people build a daily meditation
habit. Users register, browse guided sessions, open a session for the full detail,
save favorites, read a daily quote pulled from an external API, tune their
preferences and schedule reminder notifications.

---

## Features

| # | Feature | Where |
|---|---------|-------|
| 1 | User registration with validation | [`src/screens/SignupScreen.js`](src/screens/SignupScreen.js) |
| 2 | User login with error handling | [`src/screens/LoginScreen.js`](src/screens/LoginScreen.js) |
| 3 | Home screen with logo, filters and catalogue | [`src/screens/HomeScreen.js`](src/screens/HomeScreen.js) |
| 4 | Detail screen for a single session | [`src/screens/DetailScreen.js`](src/screens/DetailScreen.js) |
| 5 | Favorites and profile | [`src/screens/FavoritesScreen.js`](src/screens/FavoritesScreen.js) |
| 6 | Local persistence (AsyncStorage) | [`src/services/storage.js`](src/services/storage.js) |
| 7 | External API integration | [`src/services/api.js`](src/services/api.js) |
| 8 | Settings menu and screen | [`src/screens/SettingsScreen.js`](src/screens/SettingsScreen.js) |
| 9 | Push notifications | [`src/services/notifications.js`](src/services/notifications.js) · [`src/screens/NotificationsScreen.js`](src/screens/NotificationsScreen.js) |

The nine user stories that drove these features are in
[`docs/user-stories.md`](docs/user-stories.md).

---

## Tech stack

- **React Native 0.76** via **Expo SDK 52**
- **React Navigation 7** — native stack + bottom tabs
- **AsyncStorage** — local persistence
- **expo-notifications** — permissions, scheduling, delivery
- **DummyJSON Quotes API** (`https://dummyjson.com/quotes`) — external data source, no key required

---

## Getting started

```bash
npm install
npm start          # Expo dev server — scan the QR code with Expo Go
npm run web        # run in a browser
npm run android    # run on an Android emulator or device
```

### Running the notifications

Notifications are delivered by the operating system. Use a **physical device** or an
**emulator** to see them; the browser build shows the configuration screen but cannot
post to a native notification tray.

---

## Project structure

```
serenity-meditation-app/
├── App.js                      # Root component and providers
├── index.js                    # Expo entry point
├── app.json                    # Expo configuration
├── docs/
│   ├── user-stories.md         # The nine user stories
│   └── figma-spec.md           # Screen specifications for the Figma mockups
├── evidence/                   # Screenshots submitted for the lab
└── src/
    ├── navigation.js           # Navigation graph
    ├── context/
    │   └── AppContext.js       # Auth, favorites and settings state
    ├── components/
    │   ├── Logo.js
    │   ├── Field.js
    │   └── SessionCard.js
    ├── screens/
    │   ├── SignupScreen.js
    │   ├── LoginScreen.js
    │   ├── HomeScreen.js
    │   ├── DetailScreen.js
    │   ├── FavoritesScreen.js
    │   ├── SettingsScreen.js
    │   └── NotificationsScreen.js
    ├── services/
    │   ├── storage.js          # AsyncStorage wrapper
    │   ├── api.js              # External API client
    │   ├── notifications.js    # expo-notifications wrapper
    │   └── sessions.js         # Meditation catalogue
    └── theme/
        └── colors.js           # Light and dark palettes
```

---

## Data model

Everything is namespaced under `@serenity:` in AsyncStorage:

| Key | Contents |
|-----|----------|
| `@serenity:users` | Every registered account |
| `@serenity:session` | The account currently signed in |
| `@serenity:favorites` | Array of saved session ids |
| `@serenity:settings` | Dark mode, sounds, reminder toggle and hour |

Passwords are stored in plain text because this is a coursework application with no
backend. A production build would hash them server side and never persist the raw
value on the device.

---

## License

MIT
