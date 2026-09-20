# Figma Mockup Specification — Serenity

This document specifies the nine screens that the Figma mockups must show. Build the
frames at **390 × 844** (iPhone 14 frame) and group them as described so the two
evidence screenshots can be captured in one shot each.

---

## Design tokens

Set these up as Figma styles first — every screen reuses them.

### Colors

| Token | Hex | Used for |
|-------|-----|----------|
| Primary | `#6C4FD8` | Buttons, active states, logo mark |
| Primary soft | `#E5DDF9` | Chips, icon backgrounds |
| Accent | `#3FB5A5` | Test notification button, benefit checks |
| Background | `#F4F1FA` | Screen background |
| Surface | `#FFFFFF` | Cards, inputs |
| Surface alt | `#EFEAF8` | Secondary chips, gear button |
| Text | `#1E1B2E` | Headings and body |
| Text muted | `#6B6785` | Labels, hints, metadata |
| Border | `#DFD8F0` | Card and input borders |
| Danger | `#D64550` | Errors, favorite heart, sign out |
| Success | `#2E9E6B` | Confirmation banners |

### Type scale

| Style | Size / weight |
|-------|---------------|
| Title | 25–26 / Bold |
| Section heading | 17 / Bold |
| Body | 14.5 / Regular |
| Label | 13 / Semibold |
| Caption | 12 / Medium |
| Overline | 11.5 / Extrabold, letter-spacing 1.1 |

### Corner radii

Cards `18`, inputs and buttons `14`, chips and pills `999`, hero block `22`.

---

# figma-evidence1 — five screens

Arrange these five frames left to right on one row, then export the row as
`figma-evidence1.png`.

## 1. Login

- Centred logo mark (40 px circle, primary fill, white meditation glyph) + wordmark "Serenity"
- Title **Welcome back**, subtitle "Sign in to continue your practice."
- Field **Email** — envelope icon, placeholder `you@example.com`
- Field **Password** — padlock icon, placeholder `your password`
- Primary button **Log In**, full width, height 54
- Footer row: "Don't have an account?" + link **Sign up** in primary color

## 2. Registration

- Same logo block
- Title **Create your account**, subtitle "Start your meditation practice today."
- Field **Username** — person icon, placeholder `your name`
- Field **Email** — envelope icon, placeholder `you@example.com`
- Field **Password** — padlock icon, placeholder `at least 6 characters`
- Primary button **Sign Up**
- Footer row: "Already have an account?" + link **Log in**

## 3. Home

- Header bar: logo + wordmark on the left, circular gear button on the right, 1 px bottom border
- Greeting **Hello, Honoré** (25 / Bold), subtitle "What would you like to practise today?"
- **Quote card** — primary fill, radius 20, padding 18:
  - Overline `DAILY INSPIRATION` in white 80%, quote glyph left, refresh glyph right
  - Quote text in white, 15.5 / Medium
  - Author line `— Thich Nhat Hanh` in white 87%
  - Caption `fetched from dummyjson.com` in white 53%, italic
- **Filter row** — pills: `All` (active, primary fill, white text), then `Calm`, `Focus`, `Sleep`, `Breath` (white fill, muted text, 1.5 px border)
- Section heading **All sessions**
- **Three session cards**, each: 50 px rounded icon tile tinted from the session color, title, category pill + clock icon + duration, heart outline, chevron right
  - `Morning Stillness` · Calm · 10 min · sunrise icon · `#F3A953`
  - `Deep Focus Flow` · Focus · 15 min · target icon · `#6C4FD8`
  - `Drifting Into Sleep` · Sleep · 20 min · moon icon · `#4C6FBF`
- **Bottom tab bar** — Home (active, primary) and Favorites (muted)

## 4. Detail

- Top bar: circular back button left, circular heart button right
- **Hero block** 160 px tall, radius 22, fill = session color at 13% opacity, 62 px centred icon
- Title **Morning Stillness** (26 / Bold)
- Meta row: category pill `Calm`, clock `10 min`, voice icon `Ama Diallo`
- Section **About this session** + two-line description paragraph
- Section **Benefits** + three rows, each a teal check circle + benefit text
- Primary button **Start session** with a play glyph
- Outline button **Add to favorites** with a heart glyph

## 5. Favorites / Profile

- **Profile card**: 54 px primary circle with the initial `H`, username **Honoré**, email below in muted
- **Stat row**: two cards side by side — `2` **Favorites** (primary) and `25` **Minutes saved** (accent)
- Section heading **Your favorites**
- Two session cards with the heart **filled** in danger red
- Bottom tab bar with Favorites active

---

# figma-evidence2 — four screens

Arrange these four frames left to right on one row, then export as
`figma-evidence2.png`.

## 6. External API integration

Show the data flow, not just a screen. Suggested layout on one frame:

- Left: the Home quote card in its **loading** state (spinner in place of the text)
- Right: the same card **filled** with a quote and the `fetched from dummyjson.com` caption
- Below, a labelled arrow chain:
  `App` → `GET https://dummyjson.com/quotes/random` → `JSON { quote, author }` → `Quote card`
- A small muted note: "Network failure falls back to a bundled local quote."

## 7. Settings menu

- The Home screen with the **gear icon highlighted** — put a primary-colored focus ring
  around the circular gear button in the header
- Optionally dim the rest of the screen to 60% so the icon reads as the subject

## 8. Settings screen

- Header: back arrow, centred title **Settings**
- Overline **ACCOUNT** + card with two rows: the user (name + email) and **Edit profile** with a chevron
- Overline **PREFERENCES** + card with three toggle rows:
  - **Dark mode** — "Softer colours for evening practice" — switch off
  - **Ambient sounds** — "Play background audio during sessions" — switch **on** (primary track)
  - **Daily reminder** — "Remind me at 08:00" — switch off
- Overline **NOTIFICATIONS** + card with **Notification setup** row and a chevron
- Overline **LOCAL STORAGE** + card showing monospace key/value lines:
  - `@serenity:session` → `{"id":"u_1758...","username":"Honoré",...}`
  - `@serenity:favorites` → `["s1","s4"]`
  - `@serenity:settings` → `{"darkMode":false,"sounds":true,...}`
- Overline **ABOUT** + card with **Version** `Serenity 1.0.0` and **Privacy policy**
- Outline button **Sign out** in danger red

## 9. Notifications screen

- Header: back arrow, centred title **Notifications**
- Overline **PERMISSION** + card: green status dot, "Notification permission", status `GRANTED`
  in green uppercase, primary button **Request permission**
- Overline **DAILY REMINDER** + card:
  - Toggle row — bell icon, **Reminder is on**, "Repeats every day at 08:00", switch glyph on
  - Label "Reminder time" + six hour chips `06:00 07:00 08:00 12:00 18:00 21:00` with `08:00` active
- Overline **TEST** + card: hint text and an accent-colored button **Send a test notification**
- Overline **SCHEDULED** + card: one row "🗓 Your daily practice" and an outline **Cancel all** button
- A green success banner at the top: "Test notification sent. Check your notification tray."

---

## Export checklist

- [ ] Five frames on row 1 → export → rename `figma-evidence1.png`
- [ ] Four frames on row 2 → export → rename `figma-evidence2.png`
- [ ] Both files dropped into `evidence/`
