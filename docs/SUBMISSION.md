# Lab Submission — Serenity Meditation App

**Repository:** https://github.com/HonoreBallar/serenity-meditation-app
**Visibility:** Public
**Branch:** `main`

---

## Deliverables

| # | Deliverable | Points | Submit |
|---|-------------|--------|--------|
| 1 | Public repository link | 2 | https://github.com/HonoreBallar/serenity-meditation-app |
| 2 | User stories markdown (9 stories) | 9 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/docs/user-stories.md |
| 3 | `figma-evidence1.png` — login, registration, home, detail, favorites | 5 | **TO DO — build in Figma** (see `docs/figma-spec.md`) |
| 4 | `figma-evidence2.png` — API, settings menu, settings screen, notifications | 4 | **TO DO — build in Figma** (see `docs/figma-spec.md`) |
| 5 | Signup implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/screens/SignupScreen.js |
| 6 | `signup_screen_evidence.png` | 6 | `evidence/signup_screen_evidence.png` |
| 7 | `signup_error.png` | 2 | `evidence/signup_error.png` |
| 8 | Login implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/screens/LoginScreen.js |
| 9 | `login_screen_evidence.png` | 5 | `evidence/login_screen_evidence.png` |
| 10 | `login_error.png` | — | `evidence/login_error.png` |
| 11 | Home screen implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/screens/HomeScreen.js |
| 12 | `home-screen-evidence.png` | 4 | `evidence/home-screen-evidence.png` |
| 13 | Detail screen implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/screens/DetailScreen.js |
| 14 | `evidence-detail-navigation.png` | 2 | `evidence/evidence-detail-navigation.png` |
| 15 | `evidence-detail-screen.png` | 2 | `evidence/evidence-detail-screen.png` |
| 16 | Local storage implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/services/storage.js |
| 17 | `evidence-persistence.png` | 2 | `evidence/evidence-persistence.png` |
| 18 | `evidence-integrateScreen-persistence.png` | 2 | `evidence/evidence-integrateScreen-persistence.png` |
| 19 | API integration implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/services/api.js |
| 20 | `evidence-api-ux.png` | 2 | `evidence/evidence-api-ux.png` |
| 21 | Settings menu implementation | — | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/screens/HomeScreen.js |
| 22 | `evidence-menu-icon.png` | 2 | `evidence/evidence-menu-icon.png` |
| 23 | `evidence-menu-items.png` | 5 | `evidence/evidence-menu-items.png` |
| 24 | Settings screen implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/screens/SettingsScreen.js |
| 25 | `evidence-settings-screen.png` | 2 | `evidence/evidence-settings-screen.png` |
| 26 | Notifications implementation | 4 | https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/services/notifications.js |
| 27 | `evidence-notification-configure.png` | 2 | `evidence/evidence-notification-configure.png` |
| 28 | `evidence-notification-alert.png` | 4 | `evidence/evidence-notification-alert.png` |

---

## Notes for the grader

### Deliverable 21 — settings menu

The settings menu is the gear control in the home header. Its code is the
`settings-menu-icon` block of
[`HomeScreen.js`](https://github.com/HonoreBallar/serenity-meditation-app/blob/main/src/screens/HomeScreen.js),
which navigates to the settings screen.

### Deliverable 9 — login screen buttons

The brief asks for "a sign-up button and a sign up link" on the login screen. The
screen ships one primary **Log In** button plus a **Sign up** link to the registration
screen, which is the behaviour the two requirements together describe.

### Deliverables 27 and 28 — notifications

`src/services/notifications.js` uses `expo-notifications` on iOS and Android. Because
that package has no complete web implementation, the same functions are backed by the
browser Notification API on web, so the feature is demonstrable in every target. The
screenshots were captured from the web build.

### Screenshots

Every screenshot in `evidence/` was captured from the running application at 390 × 844
(iPhone-class viewport) at 2× device pixel ratio.

---

## Still to do

1. **Build the Figma mockups** (deliverables 3 and 4, 9 points total).
   `docs/figma-spec.md` specifies all nine screens: colors, type scale, radii and the
   exact content of each frame. Export the two rows as `figma-evidence1.png` and
   `figma-evidence2.png`.
2. Upload the screenshots from `evidence/` to the submission form under the exact names
   listed in the table above.
