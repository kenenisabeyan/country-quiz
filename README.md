# 🌍 Country Quiz Master — Global Geography Expedition

An advanced, interactive, production-grade geography expedition web application built with **React 19**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

---

## ✨ Features & Architecture

### 🎮 Dynamic Challenge Modes
- **🚩 Flag Master**: Identify nations from high-resolution national flags.
- **🏛️ Capital Cities**: Alternating matching challenges (Country ➔ Capital, or Capital ➔ Country).
- **🗺️ Wonders & Sites**: Guess countries based on famous historical landmarks, national parks, and geographic wonders.
- **📅 Seeded Daily Challenge**: Same 5-question curated expedition for all players worldwide every day.
- **🎯 Weak Spot Revision Deck**: Automatically remembers your missed countries so you can practice your weak spots.
- **🏆 Survival Mode (3 Lives ❤️❤️❤️)**: Sudden-death mode where every mistake costs a life. How far can you go?
- **🌍 World Geography Trivia**: Deep questions covering borders, continents, and geography facts.
- **⚡ Time Blitz**: Fast-paced rapid-fire gameplay with speed multipliers.

---

### 🛡️ Non-Functional Excellence
- **🚀 Performance Image Preloading**: Background image preloader caches upcoming flag images to ensure instant, zero-flicker rendering.
- **🛡️ Fault Tolerance & Error Boundary**: Top-level React Error Boundary prevents blank white screens and provides an instant one-click reload recovery screen.
- **📳 Mobile Haptic Engine**: Leverages the native Vibration API for subtle haptic feedback on correct answers, errors, and lifeline activations.
- **🎨 Multi-Atmosphere Theme Engine**: Seamless real-time switching between 4 visual themes:
  - 🌌 *Cosmic Aurora*
  - 🌲 *Terra Verde*
  - 🌋 *Solar Flare*
  - 🌊 *Cyber Oceanic*
- **♿ Full Accessibility (a11y)**: Semantic ARIA landmarks, `aria-live="polite"` screen-reader feedback, and keyboard focus outlines.
- **📱 PWA Ready**: Includes `manifest.json` and theme metadata for standalone desktop and mobile installation.

---

### 🏆 Gamification & Player Progression
- **Level & XP Progression**: Convert quiz points into XP, advancing through 8 ranks from *Novice Traveler* up to *Supreme Cartographer*.
- **Trophy Room & Badges**: 8 achievements across Bronze, Silver, Gold, and Platinum tiers with floating unlock toasts.
- **Official Certificate**: Printable and exportable credential with verified seals, candidate rank, and accuracy rating.
- **World Atlas & Study Deck**: Searchable geographic database with interactive fact sheets for 80+ nations across 6 continents.
- **Career Data Portability**: Export and import your entire career statistics and badges as JSON.

---

### ⌨️ Desktop Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`1` - `4`** or **`A` - `D`** | Instantly pick option A, B, C, or D |
| **`H`** | Reveal Continent / Country Hint |
| **`F`** | Use 50:50 Lifeline (eliminates 2 wrong choices) |
| **`S`** | Skip Question without penalty |

---

### 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Motion**: Framer Motion
- **Audio**: Web Audio API (Zero external assets, 100% offline synthesizer)
- **Data Source**: Curated global geographic dataset + The-Trivia-API fallback

---

### 🚀 Getting Started

#### 1. Clone the repository
```bash
git clone https://github.com/kenenisabeyan/country-quiz.git
cd country-quiz
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Run development server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

#### 4. Build for production
```bash
npm run build
```

---

## 📄 License
MIT License. Free to use, modify, and learn from.
